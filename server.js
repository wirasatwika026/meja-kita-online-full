require("dotenv").config();
const express = require("express");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const { sequelize } = require("./config/database");

// Import routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const bookingRoutes = require("./routes/booking");

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for production (behind reverse proxy)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }
  next();
});

// Session store
const sessionStore = new SequelizeStore({
  db: sequelize,
});

// Middleware
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure:
        process.env.NODE_ENV === "production" &&
        process.env.SECURE_COOKIES === "true",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "strict",
    },
  })
);

// View engine setup
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layout");

// Middleware untuk check authentication
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.isAdmin = req.session.user && req.session.user.role === "admin";
  next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/booking", bookingRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Home route
app.get("/", (req, res) => {
  res.render("index", {
    title: "Meja Kita Online - Reservasi Meja Restaurant",
    user: req.session.user,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    title: "Error",
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found",
  });
});

// Database connection and server start
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Create session table
    sessionStore.sync();

    // Sync database
    await sequelize.sync({ force: false });
    console.log("Database synchronized");

    // Create default admin user
    const { createDefaultAdmin } = require("./utils/createAdmin");
    await createDefaultAdmin();

    // Create sample tables
    const { createSampleTables } = require("./utils/createSampleTables");
    await createSampleTables();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
  }
}

startServer();
