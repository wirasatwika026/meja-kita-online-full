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

## 🔧 Installation & Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd meja-kita-online
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy `.env.example` ke `.env` dan sesuaikan konfigurasi:

```bash
cp .env.example .env
```

Edit file `.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=meja_kita_online
DB_USER=postgres
DB_PASSWORD=your_password

# Session Configuration
SESSION_SECRET=your-super-secret-key

# Application Configuration
PORT=3000
NODE_ENV=development

# Admin Default Account
ADMIN_EMAIL=admin@mejakita.com
ADMIN_PASSWORD=admin123
```

### 4. Setup Database

1. Buat database PostgreSQL:

```sql
CREATE DATABASE meja_kita_online;
```

2. Database tables akan dibuat otomatis saat aplikasi pertama kali dijalankan.

### 5. Run Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Aplikasi akan berjalan di `http://localhost:3000`

## 🐳 Docker Deployment

### Quick Start dengan Docker Compose

```bash
# Build dan jalankan semua services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build image
docker build -t meja-kita-online .

# Run container
docker run -p 3000:3000 meja-kita-online
```

## 👥 Default Accounts

### Admin Account

- **Email**: admin@mejakita.com
- **Password**: admin123

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

### Environment Variables untuk Production

```env
NODE_ENV=production
SESSION_SECRET=your-super-secure-session-secret
DB_HOST=your-database-host
DB_PASSWORD=your-secure-database-password
```

### Docker Production Deployment

```bash
# Build untuk production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 License

Project ini menggunakan ISC License - lihat file [LICENSE](LICENSE) untuk detail.

## 🙋‍♂️ Support

Jika Anda memiliki pertanyaan atau mengalami masalah, silakan buat issue di repository ini.

## 📧 Contact

**Author**: Yordy Wira  
**Email**: admin@mejakita.com

---

⭐ Jangan lupa untuk memberikan star jika project ini membantu Anda!
