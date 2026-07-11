# MediEquip Marketplace Backend

A complete Spring Boot backend for the MediEquip Marketplace e-commerce platform for medical equipment sales.

## Tech Stack

- **Spring Boot 3.2.0** - Main framework
- **Spring Data JPA** - Database operations
- **MySQL** - Database
- **Lombok** - Reduce boilerplate code
- **Spring Validation** - Input validation
- **Maven** - Build tool

## Features

- **Product Management**: CRUD operations for medical equipment
- **Shopping Cart**: Add, update, and remove cart items
- **Order Management**: Place orders with stock validation
- **Automatic Stock Updates**: Stock decreases after order placement
- **DTO Pattern**: Clean API responses
- **Global Exception Handling**: Centralized error management
- **Sample Data**: Pre-populated medical equipment data

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product (admin)
- `PUT /api/products/{id}` - Update product (admin)
- `DELETE /api/products/{id}` - Delete product (admin)
- `GET /api/products/category/{category}` - Get products by category
- `GET /api/products/search?name={name}` - Search products by name
- `GET /api/products/available` - Get available products (stock > 0)

### Cart
- `GET /api/cart` - Get all cart items
- `POST /api/cart/add?productId={id}&quantity={qty}` - Add item to cart
- `PUT /api/cart/{id}?quantity={qty}` - Update cart item quantity
- `DELETE /api/cart/{id}` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/{id}` - Get order by ID
- `POST /api/orders` - Place new order
- `PUT /api/orders/{id}/status?status={status}` - Update order status
- `PUT /api/orders/{id}/cancel` - Cancel order

## Database Schema

### Products
- id (PK), name, category, price, stock, description, imageUrl, timestamps

### Cart Items
- id (PK), productId, quantity, timestamps

### Orders
- id (PK), customerName, phone, address, city, pincode, totalPrice, status, timestamps

### Order Items
- id (PK), orderId (FK), productId, quantity, price

## Setup Instructions

### Prerequisites
- Java 17 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher

### Database Setup
1. Create MySQL database:
```sql
CREATE DATABASE mediequip_marketplace;
```

2. Update database credentials in `application.properties` if needed.

### Running the Application
1. Navigate to backend directory:
```bash
cd backend
```

2. Build and run:
```bash
mvn clean install
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## Sample Data

The application automatically initializes with sample medical equipment data including:
- ECG Machines
- Pulse Oximeters
- Patient Monitors
- OT Lights
- Oxygen Concentrators
- Infusion Pumps

## Business Logic

### Stock Management
- Validates stock before adding items to cart
- Prevents orders with insufficient stock
- Automatically updates stock after successful order placement
- Restores stock when orders are cancelled

### Order Processing
- Calculates total price automatically
- Validates all order data before creation
- Supports order status tracking (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)

### Error Handling
- Global exception handler for consistent error responses
- Validation errors with detailed field messages
- Business logic validation with meaningful error messages

## Configuration

### Application Properties
- Server port: 8080
- Context path: /api
- Database: MySQL (configurable)
- CORS enabled for frontend (localhost:3000)

### Environment Variables
You can customize the application by setting the following environment variables:
- `DB_HOST` - The hostname of your MySQL database (default: `localhost`)
- `DB_PORT` - The port of your MySQL database (default: `3306`)
- `DB_NAME` - The name of your database (default: `medical_equipment`)
- `DB_USERNAME` - Database user (default: `root`)
- `DB_PASSWORD` - Database password (default: `password`)
- `JWT_SECRET` - Secret key used for signing JWT tokens
- `JWT_EXPIRATION` - JWT token expiration in seconds
- `SERVER_PORT` - Backend server port (default: `8080`)

## Testing

### Sample API Calls

#### Get All Products
```bash
curl -X GET http://localhost:8080/api/products
```

#### Add to Cart
```bash
curl -X POST "http://localhost:8080/api/cart/add?productId=1&quantity=2"
```

#### Place Order
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "phone": "1234567890",
    "address": "123 Medical St",
    "city": "Healthcare City",
    "pincode": "12345",
    "items": [
      {"productId": 1, "quantity": 2}
    ]
  }'
```

## Architecture

### Layer Structure
- **Controller**: REST API endpoints
- **Service**: Business logic implementation
- **Repository**: Database operations
- **Entity**: JPA entities
- **DTO**: Data transfer objects

### Design Patterns
- Repository Pattern for data access
- DTO Pattern for API responses
- Service Layer for business logic
- Global Exception Handling

## Security

Currently uses basic validation. For production:
- Add Spring Security with JWT
- Implement role-based access control
- Add input sanitization
- Enable HTTPS

## Deployment

### Docker (Optional)
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/marketplace-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### Production Considerations
- Use environment variables for sensitive data
- Configure connection pooling
- Add monitoring and logging
- Set up database backups
- Configure reverse proxy (Nginx)

## License

This project is licensed under the MIT License.
