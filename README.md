# Sri Balaji Medi Systems — E-Commerce & Medical Services Portal

Sri Balaji Medi Systems is a unified enterprise-grade medical equipment marketplace and on-site servicing application built for healthcare providers. This document outlines the system architecture, database configurations, REST API endpoints, security structures, and deployment guides.

---

## 1. System Architecture & Tech Stack

### Backend Services
*   **Framework**: Spring Boot 3.2.0 (Spring MVC, Spring Security, Spring Data JPA)
*   **Database Migration**: Flyway Migration Engine (V1 to V17 schemas + dynamic database seeding)
*   **API Documentation**: OpenAPI 3 / Swagger-UI via SpringDoc starter
*   **Utilities**: Lombok, Jakarta validation constraints, Hibernate JSON annotations
*   **Build Tool**: Apache Maven 3.9+

### Frontend Client
*   **Core**: React JS, React Router DOM v6
*   **Styles**: Vanilla HSL tokens, responsive mobile-first layouts
*   **Auth Session**: JWT header interceptors, AuthContext, role guards

---

## 2. Setup, Build & Run Guide

This section outlines how to set up, configure, build, and run the project locally.

### Required Environment Variables

To run the application safely and enable real email delivery without committing secrets, configure the following environment variables:

| Variable | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `DB_USERNAME` | MySQL database user | `root` |
| `DB_PASSWORD` | MySQL database password | `your-database-password` |
| `SPRING_PROFILES_ACTIVE` | Active Spring Boot Profile | `prod` (for real email delivery), `dev` (console fallback) |
| `MAIL_HOST` | SMTP server host | `smtp.gmail.com` |
| `MAIL_PORT` | SMTP server port | `587` |
| `MAIL_USERNAME` | Official Website Gmail | `sribalajimedisystemsofficial@gmail.com` |
| `MAIL_PASSWORD` | Gmail App Password (16-char code) | `your-gmail-app-password` |
| `ADMIN_PASSWORD` | Secure Admin Password (MFA Step 1) | `your-admin-password` |

---

### Project Build Steps

#### ☕ Backend Build
Ensure you have Java 17+ and Maven installed:
```bash
cd backend
mvn clean install -DskipTests
```
This compiles the code and packages it into a production-ready JAR file under the `target/` folder.

#### ⚛️ Frontend Build
Ensure you have Node.js (v16+) installed:
```bash
cd frontend
npm install
npm run build
```
This installs dependencies and compiles the React application into optimized static assets under the `build/` folder.

---

### Project Execution Steps

#### 1. Database Setup
Start your local MySQL service and create the schema:
```sql
DROP DATABASE IF EXISTS medical_equipment;
CREATE DATABASE medical_equipment;
```

#### 2. Start the Backend Server
Set the environment variables in your terminal session and start the Spring Boot app:

**In Windows Command Prompt (CMD)**:
```cmd
set DB_USERNAME=root
set DB_PASSWORD=your-database-password
set SPRING_PROFILES_ACTIVE=prod
set MAIL_HOST=smtp.gmail.com
set MAIL_PORT=587
set MAIL_USERNAME=sribalajimedisystemsofficial@gmail.com
set MAIL_PASSWORD=your-gmail-app-password
set ADMIN_PASSWORD=your-admin-password

cd backend
mvn spring-boot:run
```

**In Windows PowerShell**:
```powershell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your-database-password"
$env:SPRING_PROFILES_ACTIVE="prod"
$env:MAIL_HOST="smtp.gmail.com"
$env:MAIL_PORT="587"
$env:MAIL_USERNAME="sribalajimedisystemsofficial@gmail.com"
$env:MAIL_PASSWORD="your-gmail-app-password"
$env:ADMIN_PASSWORD="your-admin-password"

cd backend
mvn spring-boot:run
```

#### 3. Start the Frontend Dev Server
Run the React client application:
```bash
cd frontend
npm start
```
Open `http://localhost:3000` in your web browser.

---

### Admin Login Flow & OTP Configuration

The administrator login implements **Multi-Factor Authentication (MFA)**:

1. **Identifier Check**: Enter `sribalajimedisystemsofficial@gmail.com` on the Sign-In page.
2. **Password Field**: The UI dynamically displays a **Password** field.
3. **MFA Step 1 (Password Validation)**: Enter the administrator password (falls back to `SBMS@2026` if `ADMIN_PASSWORD` is not set).
4. **MFA Step 2 (OTP Email)**: Click **Send OTP**. The backend validates the password and securely emails a 6-digit verification code to the Gmail inbox using the configured app password.
5. **Verify and Login**: Copy the 6-digit OTP code from Gmail, enter any name (e.g., `Admin`), and click **Verify & Login** to gain secure access to the **Owner Dashboard**.

---

## 3. Database Schemas (Flyway Pipeline)

*   `V1__create_initial_schema.sql`: Sets up core marketplace (users, products, cart_items, orders, order_items, reviews).
*   `V2__migrate_initial_data.sql`: Seeds products and owner profile records.
*   `V3__add_performance_indexes.sql`: Adds indexes to prevent slow scans.
*   `V4__add_constraints.sql`: Applies SQL price checking constraints.
*   `V5__create_services_schema.sql`: Extends database for services (requests, assignments, visits, AMC contracts, audit history logging).
*   `V6__create_payments_schema.sql`: Sets up the `payment_transactions` logging and auditing ledger.
*   `V10__create_audit_logs_table.sql`: Configures the `audit_logs` security ledger.
*   `V11__add_blocked_column_to_users.sql`: Introduces profile blockage attributes.
*   `V12__add_enabled_column_to_products.sql`: Supports product soft deletions and enabled toggles.
*   `V13__create_stock_adjustment_logs_table.sql`: Tracks manual stock replenishment history.
*   `V14__create_website_settings_table.sql`: Dynamic site settings metadata table.
*   `V15__prune_legacy_categories.sql`: Prunes unused categories to leave active medical folders.
*   `V16__restrict_super_admin.sql`: Restricts `is_super_owner = true` to `sribalajimedisystemsofficial@gmail.com`.
*   `V17__alter_orders_status_enum.sql`: Expands order status enum options in MySQL.

---

## 4. REST API Reference

### Authentication (`/api/auth`)
*   `POST /api/auth/send-otp`: Sends a mock SMS/email login OTP.
*   `POST /api/auth/verify-otp`: Validates OTP and signs a stateless JWT.
*   `GET /api/auth/me`: Retrieves current authenticated user profile details.

### Product Catalog (`/api/products`)
*   `GET /api/products`: Lists products with pagination.
*   `GET /api/products/{id}`: Retrieves specifications and features in JSON format.
*   `GET /api/products/search?name={q}`: Catalog search.

### Shopping Cart (`/api/cart`)
*   `GET /api/cart`: Retrieve user's isolated cart items.
*   `POST /api/cart/add?productId={id}&quantity={qty}`: Scoped add-to-cart.
*   `PUT /api/cart/{id}?quantity={qty}`: Update item count.
*   `DELETE /api/cart/{id}`: Drop cart item.
*   `DELETE /api/cart/clear`: User-scoped cart clear.

### Customer Services (`/api/services/customer`)
*   `POST /api/services/customer/requests`: Creates service visit request.
*   `GET /api/services/customer/requests/{id}/visits`: Track technician visits.
*   `GET /api/services/customer/requests/{id}/assignment`: View assigned field engineer.
*   `POST /api/services/customer/invoices/{id}/pay`: Settle service bill.
*   `POST /api/services/customer/amc/subscribe`: Purchase Annual Maintenance Contract.

### Technician Services (`/api/services/technician`)
*   `GET /api/services/technician/jobs`: View assigned visits queue.
*   `POST /api/services/technician/assignments/{id}/visits`: Start diagnostic check visits.
*   `PUT /api/services/technician/visits/{id}/complete`: Log action summaries and upload reports.
*   `POST /api/services/technician/visits/{id}/parts/reserve`: Reserve parts from inventory catalog.

### Owner Management (`/api/services/owner`)
*   `GET /api/services/owner/requests`: View all service request pipelines.
*   `POST /api/services/owner/requests/{id}/assign`: Dispatch field technician.
*   `POST /api/services/owner/requests/{id}/invoice`: Calculate parts costs and generate service bill.
*   `POST /api/services/owner/engineers`: Register technician profiles.

### Payments Integration (`/api/payments/razorpay`)
*   `POST /api/payments/razorpay/create-order`: Create a unique Razorpay transaction order code.
*   `POST /api/payments/razorpay/verify-payment`: Verify HMAC-SHA256 signature returned by checkout scripts.

---

## 5. Security & Isolation Controls

1.  **JWT Scoped Authentication**: Interceptors check headers for authorization tokens. Session contexts are stateless.
2.  **Role Enforcement**: Method access is guarded via Spring pre-authorizations:
    *   `ROLE_USER`: Can only query their own carts, orders, services requests, and AMC contracts.
    *   `ROLE_TECHNICIAN`: Can only view jobs assigned to their engineer profile.
    *   `ROLE_OWNER`: Full administrative access.
3.  **Concurrency Protection**: `@Version` tags guard entities (product stock updates, service dispatches) against concurrent modification anomalies.
4.  **Transaction Safety**: Core actions are wrapped under `@Transactional` to ensure automatic rollback on failure.

---

## 6. Docker Deployment Guide

1. Build backend jar file:
   ```bash
   mvn clean package
   ```
2. Build and run containers using Docker Compose:
   ```bash
   docker-compose up --build
   ```
