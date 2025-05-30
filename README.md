# Festivo - Event Management System

## Overview
Festivo is a web-based event management system that facilitates user management, event operations, supplier management, and payment processing. The system is developed using **React + Vite (TypeScript)** for the frontend and **Spring Boot** with **MongoDB** for the backend.

---

## Features
### 1. **User Management**
   - User Registration & Authentication
   - Profile Management
   - Role-Based Access Control

### 2. **Event Operation Management**
   - Create, Update, and Delete Events
   - Manage Event Details
   - Event Notifications & Reminders

### 3. **Supplier Management**
   - Supplier Registration & Management
   - Performance Tracking
   - Product & Service Listings

### 4. **Payment Management**
   - Payment Processing
   - Order Invoicing
   - Payment History & Reports

---

## Tech Stack
### **Frontend** (Client)
- **React + Vite (TypeScript)**
- React Router for navigation
- Tailwind CSS for styling

### **Backend** (Server - Spring Boot)
- Spring Boot (Java)
- Spring Data MongoDB
- RESTful APIs

---

## Project Structure
### **Frontend (Client - React + Vite)**
```
Src/
├── api/                # API endpoint URLs
├── components/         # Reusable UI components (Headers, Footers, etc.)
├── views/             
│   ├── user/          # User-related views
│   ├── events/        # Event pages
│   ├── suppliers/     # Supplier management pages
│   ├── payments/      # Payment-related views
│   ├── admin/         # Admin dashboard
├── App.tsx            # Main application entry
├── routers.tsx        # Application routing
```

### **Backend (Server - Spring Boot)**
### **Package Structure**
```
src/main/java/com/example/festivo/controller/
src/main/java/com/example/festivo/dto/
src/main/java/com/example/festivo/entity/
src/main/java/com/example/festivo/repository/
src/main/java/com/example/festivo/service/

Festivo/
├── src/
│   ├── main/java/com/example/festivo/
│   │   ├── controller/         # API Controllers
│   │   │   ├── usercontroller/
│   │   │   │   ├── UserController.java
│   │   │   ├── eventcontroller/
│   │   │   │   ├── EventController.java
│   │   │   ├── suppliercontroller/
│   │   │   │   ├── SupplierController.java
│   │   │   ├── paymentcontroller/
│   │   │   │   ├── PaymentController.java
│   │   ├── dto/                # Data Transfer Objects
│   │   │   ├── userdto/
│   │   │   │   ├── UserRequestDTO.java & UserResponseDTO.java
│   │   │   ├── eventdto/
│   │   │   │   ├── EventRequestDTO.java & EventResponseDTO.java
│   │   │   ├── supplierdto/
│   │   │   │   ├── SupplierRequestDTO.java & SupplierResponseDTO.java
│   │   │   ├── paymentdto/
│   │   │   │   ├── PaymentRequestDTO.java & PaymentResponseDTO.java
│   │   ├── entity/             # Entity (Database models)
│   │   │   ├── userentity/
│   │   │   │   ├── User.java
│   │   │   ├── evententity/
│   │   │   │   ├── Event.java
│   │   │   ├── supplierentity/
│   │   │   │   ├── Supplier.java
│   │   │   ├── paymententity/
│   │   │   │   ├── Payment.java
│   │   ├── repository/         # MongoDB Repositories
│   │   │   ├── userrepository/
│   │   │   │   ├── UserRepository.java
│   │   │   ├── eventrepository/
│   │   │   │   ├── EventRepository.java
│   │   │   ├── supplierrepository/
│   │   │   │   ├── SupplierRepository.java
│   │   │   ├── paymentrepository/
│   │   │   │   ├── PaymentRepository.java
│   │   ├── service/            # Business Logic
│   │   │   ├── userservice/
│   │   │   │   ├── UserService.java
│   │   │   ├── eventservice/
│   │   │   │   ├── EventService.java
│   │   │   ├── supplierservice/
│   │   │   │   ├── SupplierService.java
│   │   │   ├── paymentservice/
│   │   │   │   ├── PaymentService.java
```

## Installation
### **Frontend Setup**
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/festivo.git
   cd festivo/client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

### **Backend Setup**
1. Navigate to the backend folder:
   ```sh
   cd festivo/server
   ```
2. Configure MongoDB connection in `application.properties`:
   ```properties
   spring.data.mongodb.uri=mongodb://localhost:27017/festivo
   ```
3. Build and run the application:
   ```sh
   mvn spring-boot:run
   ```

---

## API Endpoints
### **User Management**
| Method | Endpoint        | Description          |
|--------|----------------|----------------------|
| GET    | /users         | Get all users       |
| POST   | /users         | Create a user       |
| GET    | /users/{id}    | Get user by ID      |
| PUT    | /users/{id}    | Update user details |
| DELETE | /users/{id}    | Delete user         |

### **Event Management**
| Method | Endpoint        | Description            |
|--------|----------------|------------------------|
| GET    | /events        | Get all events        |
| POST   | /events        | Create an event       |
| GET    | /events/{id}   | Get event by ID       |
| PUT    | /events/{id}   | Update event details  |
| DELETE | /events/{id}   | Delete event          |

(Additional endpoints for suppliers and payments follow a similar structure.)

---

## License
This project is licensed under the [MIT License](LICENSE).

