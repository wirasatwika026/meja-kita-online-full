# Setup Instructions for Meja Kita Online

## Quick Start Guide

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v15 or higher) OR Docker & Docker Compose

### Installation Steps

1. **Clone or prepare the project files**

   ```bash
   cd "Meja Kita Online"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   - Copy the `.env` file and modify as needed
   - Default admin credentials: admin@mejakita.com / admin123

4. **Database Setup**

   **Option A: Using Docker (Recommended)**

   ```bash
   # Start PostgreSQL only
   docker-compose up postgres -d

   # Or start everything with Docker
   docker-compose up -d
   ```

   **Option B: Manual PostgreSQL Setup**

   - Install PostgreSQL on your system
   - Create database: `CREATE DATABASE meja_kita_online;`
   - Update `.env` with your database credentials

5. **Run the application**

   ```bash
   # Development mode (with auto-restart)
   npm run dev

   # Production mode
   npm start
   ```

6. **Access the application**
   - Open browser: http://localhost:3000
   - Admin login: admin@mejakita.com / admin123
   - Create new user account or use existing admin

### Features Available

#### For Users:

- Register and login
- Browse available tables
- Book tables with date/time selection
- View booking history
- Cancel bookings
- Update profile

#### For Admins:

- Complete dashboard overview
- Manage tables (CRUD operations)
- Manage all bookings (approve/reject)
- Manage users
- View statistics

### Database Schema

The application will automatically create these tables:

- **users**: User accounts and authentication
- **tables**: Restaurant table information
- **bookings**: Table reservations
- **Sessions**: Session management

### Sample Data

The application automatically creates:

- Default admin user
- 8 sample tables with different capacities and locations

### Technology Stack

- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL + Sequelize ORM
- **Frontend**: EJS templates + Bootstrap 5
- **Authentication**: Session-based with bcrypt
- **Deployment**: Docker support

### Troubleshooting

1. **Database connection error**

   - Ensure PostgreSQL is running
   - Check `.env` database credentials
   - For Docker: run `docker-compose up postgres -d`

2. **Port already in use**

   - Change PORT in `.env` file
   - Kill existing process on port 3000

3. **Permission errors**
   - Ensure you have write permissions in the project directory
   - For Docker: ensure Docker Desktop is running

### Development

- Run `npm run dev` for development with auto-restart
- Access admin panel: http://localhost:3000/admin/dashboard
- View user dashboard: http://localhost:3000/user/dashboard

### Deployment

The application is ready for deployment with Docker:

```bash
docker-compose up -d
```

This will start both the application and PostgreSQL database in containers.
