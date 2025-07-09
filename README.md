# Meja Kita Online

Aplikasi web full stack untuk sistem booking meja restaurant yang dibangun dengan Node.js, Express.js, PostgreSQL, dan dapat di-dockerize.

## 🚀 Fitur Utama

- **Authentication System**: Login/logout dengan session-based authentication
- **Role Management**: Dua role berbeda (User dan Admin)
- **Table Booking**: Sistem reservasi meja yang mudah digunakan
- **Admin Dashboard**: Panel admin untuk mengelola meja, booking, dan user
- **Responsive Design**: UI yang responsif dengan Bootstrap 5
- **Docker Support**: Dapat dijalankan dengan Docker dan Docker Compose

## 🛠️ Teknologi Yang Digunakan

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **bcryptjs** - Password hashing
- **express-session** - Session management

### Frontend

- **EJS** - Template engine
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icons
- **Vanilla JavaScript** - Client-side scripting

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📋 Prerequisites

- Node.js (v18 atau lebih baru)
- PostgreSQL (v15 atau lebih baru)
- Docker & Docker Compose (untuk deployment)


### User Account

Pengguna dapat mendaftar akun baru melalui halaman register.

## 📱 Fitur Aplikasi

### Untuk User

- **Register & Login**: Pendaftaran dan masuk akun
- **Dashboard**: Overview booking dan profil
- **Browse Tables**: Melihat meja yang tersedia
- **Book Table**: Melakukan reservasi meja
- **Manage Bookings**: Melihat dan membatalkan booking
- **Profile Management**: Mengelola profil pengguna

### Untuk Admin

- **Admin Dashboard**: Overview statistik sistem
- **Manage Tables**: CRUD operasi untuk meja
- **Manage Bookings**: Kelola semua booking (approve/reject)
- **Manage Users**: Kelola pengguna sistem

## 🗂️ Struktur Project

```
meja-kita-online/
├── config/
│   └── database.js          # Konfigurasi database
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   ├── User.js              # Model User
│   ├── Table.js             # Model Table
│   ├── Booking.js           # Model Booking
│   └── index.js             # Model associations
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── admin.js             # Admin routes
│   ├── user.js              # User routes
│   └── booking.js           # Booking routes
├── views/
│   ├── auth/                # Authentication templates
│   ├── admin/               # Admin templates
│   ├── user/                # User templates
│   ├── booking/             # Booking templates
│   ├── layout.ejs           # Main layout
│   ├── index.ejs            # Homepage
│   ├── 404.ejs              # 404 page
│   └── error.ejs            # Error page
├── public/
│   ├── css/
│   │   └── style.css        # Custom styles
│   └── js/
│       └── app.js           # Client-side JavaScript
├── utils/
│   └── createAdmin.js       # Utility untuk create admin
├── server.js                # Main server file
├── package.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🔐 Security Features

- Password hashing dengan bcryptjs
- Session-based authentication
- Role-based access control
- Input validation dan sanitization
- CSRF protection ready
- SQL injection prevention (Sequelize ORM)

## 🚀 Deployment


---

⭐ Jangan lupa untuk memberikan star jika project ini membantu Anda!
