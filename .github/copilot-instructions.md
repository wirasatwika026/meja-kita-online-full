<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Meja Kita Online - Development Instructions

This is a full-stack Node.js web application for restaurant table booking system with the following architecture:

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Frontend**: EJS templates with Bootstrap 5
- **Authentication**: Session-based with bcryptjs
- **Deployment**: Docker and Docker Compose support

## Project Structure

- `/config` - Database configuration
- `/models` - Sequelize models (User, Table, Booking)
- `/routes` - Express routes (auth, admin, user, booking)
- `/middleware` - Custom middleware (authentication)
- `/views` - EJS templates organized by features
- `/public` - Static assets (CSS, JS, images)
- `/utils` - Utility functions

## Key Features

- User registration and authentication
- Role-based access control (User/Admin)
- Table booking system with conflict checking
- Admin dashboard for managing tables, bookings, and users
- Responsive UI with Bootstrap 5

## Development Guidelines

- Use async/await for database operations
- Implement proper error handling and validation
- Follow RESTful routing conventions
- Use EJS partials for reusable components
- Maintain consistent code formatting
- Include proper JSDoc comments for functions

## Database Schema

- **Users**: id, name, email, password, phone, role, isActive
- **Tables**: id, tableNumber, capacity, location, description, isAvailable, pricePerHour
- **Bookings**: id, userId, tableId, bookingDate, startTime, endTime, guestCount, specialRequests, status, totalAmount

## Environment Variables

- Database configuration (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)
- Session secret (SESSION_SECRET)
- Application settings (PORT, NODE_ENV)
- Default admin credentials (ADMIN_EMAIL, ADMIN_PASSWORD)
