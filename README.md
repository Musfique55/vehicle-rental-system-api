# 🚗 Vehicle Rental System API (Modular)

**A secure and scalable Vehicle Rental System backend API built with a modular architecture and powered by Express, TypeScript, and PostgreSQL.**

---

## 1. Project Overview & Live URL

This project serves as the robust backend for a vehicle rental service, designed with a clean, maintainable modular pattern. It handles user authentication, vehicle management, and booking creation.

### Live Deployment URL

> `[https://car-booking-system-hazel.vercel.app/]`

## 2. Key Features & Technology Stack

### Key Features

* **Modular Architecture:** Organized structure separating routes, controllers, services, and models for improved maintainability and scalability.
* **Secure Authentication:** Token-based security using **JWT (JSON Web Tokens)** for user registration and login.
* **Password Security:** Strong password hashing implemented with **bcrypt.js** to secure user credentials.
* **Vehicle CRUD:** Full functionality to Create, Read, Update, and Delete vehicle listings.
* **Booking Management:** API endpoints for creating and tracking rental reservations.
* **Data Integrity:** Utilizes TypeScript for robust type checking and includes input validation.

### Technology Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | **Express.js** | Minimalist and flexible Node.js web application framework. |
| **Language** | **TypeScript (TS)** | Ensures type safety and enhances code quality for large-scale applications. |
| **Database** | **PostgreSQL** | Reliable, feature-rich relational database management system. |
| **DB Hosting** | **Neon DB** | Serverless hosting solution for PostgreSQL. |
| **Authentication** | **JWT** | Used for creating secure access tokens. |
| **Security** | **bcrypt.js** | Library for hashing and securing passwords. |

## 3. Setup & Usage Instructions

Follow these steps to get the API running on your local machine.

---

### Prerequisites

Ensure you have the following installed:

* **Node.js** (LTS version recommended)
* **npm** or **yarn**

### Step 1: Clone the Repository

Clone the project repository to your local machine:

```bash
git clone <https://github.com/Musfique55/vehicle-rental-system-api.git>
cd vehicle-rental-system-api
```
### Step 2: Install Dependencies

Install all the necessary Node.js packages:

```bash
npm install
# or
yarn install
```
### Step 3: Configure Environment Variables
Create a file named .env in the root directory and add your configuration details. This is crucial for connecting to your Neon DB/PostgreSQL instance and setting up JWT security.

```bash
# Server Port
PORT=5000

# Neon DB/PostgreSQL Connection URL
DATABASE_URL="postgresql://user:password@host:port/database"

# Secret Key for JWT Token Signing
JWT_SECRET="YOUR_STRONG_SECRET_KEY_HERE"

```

### Step 4: Run the Server
Start the application in development mode (which typically includes TypeScript compilation):

```bash
npm run dev
# or 
yarn dev
```
The API will be running at > `[http://localhost:5000]` 

## 4. API Endpoints Reference
The following tables detail the available endpoints, required HTTP methods, and access restrictions for the API. All endpoints are prefixed with /api/v1

### Authentication

| Method | Endpoint               | Access  | Description                     |
|--------|-----------------------|---------|---------------------------------|
| POST   | /api/v1/auth/signup    | Public  | Register a new user account     |
| POST   | /api/v1/auth/signin    | Public  | Login and receive JWT token     |

### Vehicles

| Method | Endpoint                 | Access       | Description                                                           |
|--------|-------------------------|-------------|-----------------------------------------------------------------------|
| POST   | /api/v1/vehicles        | Admin only   | Add new vehicle with name, type, registration, daily rent price, and availability status |
| GET    | /api/v1/vehicles        | Public       | View all vehicles in the system                                       |
| GET    | /api/v1/vehicles/:vehicleId | Public   | View specific vehicle details                                         |
| PUT    | /api/v1/vehicles/:vehicleId | Admin only | Update vehicle details, daily rent price, or availability status      |
| DELETE | /api/v1/vehicles/:vehicleId | Admin only | Delete vehicle (only if no active bookings exist)                     |

### Users

| Method | Endpoint               | Access        | Description                                                      |
|--------|-----------------------|--------------|------------------------------------------------------------------|
| GET    | /api/v1/users         | Admin only    | View all users in the system                                     |
| PUT    | /api/v1/users/:userId | Admin or Own  | Admin: Update any user's role or details<br>Customer: Update own profile only |
| DELETE | /api/v1/users/:userId | Admin only    | Delete user (only if no active bookings exist)                   |

### Bookings

| Method | Endpoint                 | Access         | Description                                                                                 |
|--------|-------------------------|---------------|---------------------------------------------------------------------------------------------|
| POST   | /api/v1/bookings        | Customer or Admin | Create booking with start/end dates. Validates availability, calculates total price, and updates vehicle status |
| GET    | /api/v1/bookings        | Role-based    | Admin: View all bookings<br>Customer: View own bookings only                                |
| PUT    | /api/v1/bookings/:bookingId | Role-based | Customer: Cancel booking (before start date only)<br>Admin: Mark as "returned" (updates vehicle to "available")<br>System: Auto-mark as "returned" when period ends |

## 5. Modular Structure
The project follows a modular pattern, organizing functionality by domain to ensure separation of concerns and ease of maintenance.

### Core Structure

> `[src/routes/:]` Defines the API endpoints and directs traffic to the correct controller.

> `[src/controllers/:]` Contains the core business logic handlers for requests (e.g., handling inputs, calling services).

> `[src/services/:]` Abstracts data access and complex logic (e.g., fetching data from the database, calculating prices).

> `[src/models/:]` Defines the data structure and interacts directly with the database (using an ORM or raw SQL).

> `[src/middleware/:]` Contains functions for authentication (JWT verification), authorization (role checks), and validation.
