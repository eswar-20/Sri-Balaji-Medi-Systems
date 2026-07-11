package com.mediequip.marketplace.service;

import com.mediequip.marketplace.dto.PaymentOrderRequest;
import com.mediequip.marketplace.dto.PaymentOrderResponse;
import com.mediequip.marketplace.dto.PaymentVerificationRequest;
import com.mediequip.marketplace.entity.*;
import com.mediequip.marketplace.repository.*;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final ServiceInvoiceRepository serviceInvoiceRepository;
    private final AMCContractRepository amcContractRepository;
    private final ServiceAuditLogRepository serviceAuditLogRepository;
    private final CartService cartService;
    private final UserService userService;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    private RazorpayClient razorpayClient;

    @PostConstruct
    public void init() {
        try {
            if (keyId != null && !keyId.isEmpty() && keySecret != null && !keySecret.isEmpty()) {
                this.razorpayClient = new RazorpayClient(keyId, keySecret);
                log.info("Razorpay Client successfully initialized with Key ID: {}", keyId);
            } else {
                log.warn("Razorpay API keys not configured. Payment client not initialized.");
            }
        } catch (RazorpayException e) {
            log.error("Failed to initialize Razorpay Client", e);
        }
    }

    @Transactional
    public PaymentOrderResponse createOrder(PaymentOrderRequest request, String userEmail) {
        log.info("Creating Razorpay order for user: {}, refType: {}, refId: {}, amount: {}", 
                userEmail, request.getReferenceType(), request.getReferenceId(), request.getAmount());

        User user = userService.getUserByIdentifier(userEmail);
        
        // 1. Verify that the referenced entity exists and has correct amounts
        validateReference(request, user.getId());

        if (this.razorpayClient == null) {
            throw new IllegalStateException("Razorpay client is not initialized. Check server configurations.");
        }

        try {
            // Convert amount to paisa (multiplied by 100)
            long amountInPaisa = request.getAmount().multiply(new BigDecimal("100")).longValue();

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaisa);
            orderRequest.put("currency", request.getCurrency());
            orderRequest.put("receipt", "receipt_u" + user.getId() + "_" + request.getReferenceType().name().toLowerCase() + "_" + request.getReferenceId());

            // Create Razorpay Order
            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            String razorpayOrderId = razorpayOrder.get("id");

            // 2. Save payment transaction record with status CREATED
            PaymentTransaction transaction = PaymentTransaction.builder()
                    .userId(user.getId())
                    .razorpayOrderId(razorpayOrderId)
                    .amount(request.getAmount())
                    .currency(request.getCurrency())
                    .status(PaymentStatus.CREATED)
                    .referenceType(request.getReferenceType())
                    .referenceId(request.getReferenceId())
                    .retryCount(0)
                    .build();

            paymentRepository.save(transaction);

            log.info("Successfully created PaymentTransaction record. Order ID: {}", razorpayOrderId);

            return PaymentOrderResponse.builder()
                    .razorpayOrderId(razorpayOrderId)
                    .amount(amountInPaisa)
                    .currency(request.getCurrency())
                    .keyId(keyId)
                    .status("CREATED")
                    .build();

        } catch (RazorpayException e) {
            log.error("Razorpay exception during order creation", e);
            throw new RuntimeException("Error communicating with payment gateway: " + e.getMessage());
        }
    }

    @Transactional
    public boolean verifyPayment(PaymentVerificationRequest request, String userEmail) {
        log.info("Verifying Razorpay payment signature for orderId: {}, paymentId: {}", 
                request.getRazorpayOrderId(), request.getRazorpayPaymentId());

        User user = userService.getUserByIdentifier(userEmail);

        // 1. Load the transaction and check for duplicate/idempotency protection
        PaymentTransaction transaction = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found for order: " + request.getRazorpayOrderId()));

        // Security check: verify this transaction belongs to the verified user
        if (!transaction.getUserId().equals(user.getId())) {
            throw new SecurityException("Unauthorized payment verification attempt.");
        }

        // Idempotency: If transaction is already marked paid, return true
        if (transaction.getStatus() == PaymentStatus.PAID) {
            log.info("Transaction for orderId: {} already marked PAID. Returning cached success status (idempotent request).", 
                    request.getRazorpayOrderId());
            return true;
        }

        // 2. Verify Razorpay Payment Signature
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.getRazorpayOrderId());
            options.put("razorpay_payment_id", request.getRazorpayPaymentId());
            options.put("razorpay_signature", request.getRazorpaySignature());

            boolean isValid = com.razorpay.Utils.verifyPaymentSignature(options, keySecret);
            if (!isValid) {
                throw new SignatureException("Razorpay signature validation failed.");
            }
        } catch (Exception e) {
            log.error("Payment signature verification failed for orderId: {}", request.getRazorpayOrderId(), e);
            transaction.setStatus(PaymentStatus.FAILED);
            transaction.setErrorMessage("Signature validation failed: " + e.getMessage());
            transaction.setRetryCount(transaction.getRetryCount() + 1);
            paymentRepository.save(transaction);
            throw new RuntimeException("Payment signature verification failed. Details saved in log.");
        }

        // 3. Signature is valid. Proceed to fetch actual payment method details from Razorpay APIs
        String paymentMethod = "UNKNOWN";
        try {
            if (this.razorpayClient != null) {
                com.razorpay.Payment payment = razorpayClient.payments.fetch(request.getRazorpayPaymentId());
                paymentMethod = payment.get("method");
            }
        } catch (RazorpayException e) {
            log.warn("Could not fetch payment details from Razorpay APIs for verification audit logs", e);
        }

        // 4. Update the PaymentTransaction state to PAID
        transaction.setStatus(PaymentStatus.PAID);
        transaction.setRazorpayPaymentId(request.getRazorpayPaymentId());
        transaction.setRazorpaySignature(request.getRazorpaySignature());
        transaction.setPaymentMethod(paymentMethod);
        paymentRepository.save(transaction);

        // 5. Update reference entity state
        updateReferenceState(transaction, userEmail);

        log.info("Payment signature successfully verified. Reference updated. OrderId: {}, PaymentId: {}", 
                request.getRazorpayOrderId(), request.getRazorpayPaymentId());
        return true;
    }

    private void validateReference(PaymentOrderRequest request, Long userId) {
        switch (request.getReferenceType()) {
            case STORE_ORDER:
                Order order = orderRepository.findById(request.getReferenceId())
                        .orElseThrow(() -> new IllegalArgumentException("Store order not found with ID: " + request.getReferenceId()));
                if (!order.getUser().getId().equals(userId)) {
                    throw new SecurityException("Unauthorized order reference check.");
                }
                if (order.getStatus() == Order.OrderStatus.CANCELLED) {
                    throw new IllegalStateException("Cannot pay for a cancelled order.");
                }
                if (order.getPaymentStatus() == Order.PaymentStatus.PAID) {
                    throw new IllegalStateException("Store order is already paid.");
                }
                if (order.getTotalPrice().compareTo(request.getAmount()) != 0) {
                    throw new IllegalArgumentException("Amount mismatch with store order total: " + order.getTotalPrice());
                }
                break;

            case SERVICE_INVOICE:
                ServiceInvoice invoice = serviceInvoiceRepository.findById(request.getReferenceId())
                        .orElseThrow(() -> new IllegalArgumentException("Service invoice not found with ID: " + request.getReferenceId()));
                if (!invoice.getServiceRequest().getUser().getId().equals(userId)) {
                    throw new SecurityException("Unauthorized invoice reference check.");
                }
                if (invoice.getInvoiceStatus() == InvoiceStatus.PAID) {
                    throw new IllegalStateException("Service invoice is already paid.");
                }
                if (invoice.getTotalAmount().compareTo(request.getAmount()) != 0) {
                    throw new IllegalArgumentException("Amount mismatch with invoice total: " + invoice.getTotalAmount());
                }
                break;

            case AMC_CONTRACT:
                AMCContract contract = amcContractRepository.findById(request.getReferenceId())
                        .orElseThrow(() -> new IllegalArgumentException("AMC contract not found with ID: " + request.getReferenceId()));
                if (!contract.getUser().getId().equals(userId)) {
                    throw new SecurityException("Unauthorized AMC contract reference check.");
                }
                if (contract.getContractStatus() == AMCStatus.ACTIVE) {
                    throw new IllegalStateException("AMC Contract is already active.");
                }
                if (contract.getPrice().compareTo(request.getAmount()) != 0) {
                    throw new IllegalArgumentException("Amount mismatch with contract total: " + contract.getPrice());
                }
                break;

            default:
                throw new IllegalArgumentException("Unsupported reference type: " + request.getReferenceType());
        }
    }

    private void updateReferenceState(PaymentTransaction transaction, String userEmail) {
        switch (transaction.getReferenceType()) {
            case STORE_ORDER:
                Order order = orderRepository.findById(transaction.getReferenceId())
                        .orElseThrow(() -> new IllegalArgumentException("Store order not found: " + transaction.getReferenceId()));
                order.setPaymentStatus(Order.PaymentStatus.PAID);
                order.setStatus(Order.OrderStatus.PROCESSING);
                order.setPaymentMethod(transaction.getPaymentMethod());
                orderRepository.save(order);

                // Clear customer's shopping cart after payment is fully verified
                cartService.clearCart(userEmail);
                log.info("Cleared shopping cart for user: {}", userEmail);
                break;

            case SERVICE_INVOICE:
                ServiceInvoice invoice = serviceInvoiceRepository.findById(transaction.getReferenceId())
                        .orElseThrow(() -> new IllegalArgumentException("Service invoice not found: " + transaction.getReferenceId()));
                invoice.setInvoiceStatus(InvoiceStatus.PAID);
                serviceInvoiceRepository.save(invoice);

                // Log a paid event to service audits log
                serviceAuditLogRepository.save(ServiceAuditLog.builder()
                        .serviceRequest(invoice.getServiceRequest())
                        .action(ServiceAction.INVOICE_PAID)
                        .notes("Service invoice of amount " + invoice.getTotalAmount() + " successfully settled via Razorpay.")
                        .performedBy(userEmail)
                        .timestamp(LocalDateTime.now())
                        .build());
                log.info("Service invoice ID: {} marked PAID and audit log recorded.", invoice.getId());
                break;

            case AMC_CONTRACT:
                AMCContract contract = amcContractRepository.findById(transaction.getReferenceId())
                        .orElseThrow(() -> new IllegalArgumentException("AMC contract not found: " + transaction.getReferenceId()));
                contract.setContractStatus(AMCStatus.ACTIVE);
                amcContractRepository.save(contract);
                log.info("AMC Contract ID: {} marked ACTIVE.", contract.getId());
                break;
        }
    }

    private static class SignatureException extends Exception {
        public SignatureException(String message) {
            super(message);
        }
    }
}
