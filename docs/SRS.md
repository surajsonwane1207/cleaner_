# Software Requirements Specification (SRS) - BharatClean

## 1. Introduction
BharatClean is a professional cleaning service platform that connects customers with professional cleaners. The platform handles user registrations, service bookings, subscription plans, and customer support.

## 2. Overall Description
### 2.1 Product Perspective
A full-stack web application built with Next.js, using Prisma as an ORM and SQLite/PostgreSQL as the database.

### 2.2 Product Functions
- **User Management**: Authentication and Role-based access (Customer, Cleaner, Admin).
- **Subscription System**: Integration with Razorpay for recurring billing and plans.
- **Booking Management**: Scheduling cleanings between customers and available cleaners.
- **Support System**: Ticket submission for inquiries and feedback.
- **Review System**: Rating and reviewing cleaning sessions.

### 2.3 User Interface Overview
![Landing Page Wireframe](./images/wireframe_landing.svg)

## 3. System Features
### 3.1 Authentication
- Users can register and login using NextAuth.js.
- Secure password hashing with bcrypt.

### 3.2 Booking Flow
- Customers can select services, dates, and provide addresses.
- Bookings transition through states: PENDING -> CONFIRMED -> COMPLETED.

### 3.3 Support Portal
- Guest and registered users can submit tickets via a public support page.
- Tickets are persisted in the database for admin review.

## 4. Non-Functional Requirements
### 4.1 Performance
- Responsive UI using Tailwind CSS.
- Optimized database queries via Prisma.

### 4.2 Security
- CSRF protection.
- Secure session management.
- Data validation on both client and server sides.
