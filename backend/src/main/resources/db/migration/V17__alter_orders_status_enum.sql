-- Alter orders status enum column to support the full Amazon-style fulfillment pipeline
ALTER TABLE orders MODIFY COLUMN status ENUM(
    'PENDING', 
    'PROCESSING', 
    'CONFIRMED', 
    'PACKED', 
    'READY_TO_SHIP', 
    'SHIPPED', 
    'OUT_FOR_DELIVERY', 
    'DELIVERED', 
    'COMPLETED', 
    'CANCELLED', 
    'RETURNED', 
    'REFUNDED'
) NOT NULL DEFAULT 'PENDING';
