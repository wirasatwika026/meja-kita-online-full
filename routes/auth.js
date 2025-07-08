const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { redirectIfLoggedIn } = require("../middleware/auth");

const router = express.Router();

// GET /auth/login
router.get("/login", redirectIfLoggedIn, (req, res) => {
  res.render("auth/login", {
    title: "Login - Meja Kita Online",
    errors: [],
    formData: {},
  });
});

// POST /auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("auth/login", {
        title: "Login - Meja Kita Online",
        errors: errors.array(),
        formData: req.body,
      });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email, isActive: true } });

      if (!user || !(await user.checkPassword(password))) {
        return res.render("auth/login", {
          title: "Login - Meja Kita Online",
          errors: [{ msg: "Invalid email or password" }],
          formData: req.body,
        });
      }

      // Set session
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      // Redirect based on role
      const redirectTo =
        req.session.returnTo ||
        (user.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
      delete req.session.returnTo;

      res.redirect(redirectTo);
    } catch (error) {
      console.error("Login error:", error);
      res.render("auth/login", {
        title: "Login - Meja Kita Online",
        errors: [{ msg: "Something went wrong. Please try again." }],
        formData: req.body,
      });
    }
  }
);

// GET /auth/register
router.get("/register", redirectIfLoggedIn, (req, res) => {
  res.render("auth/register", {
    title: "Register - Meja Kita Online",
    errors: [],
    formData: {},
  });
});

// POST /auth/register
router.post(
  "/register",
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
    body("phone")
      .optional()
      .isMobilePhone()
      .withMessage("Please enter a valid phone number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("auth/register", {
        title: "Register - Meja Kita Online",
        errors: errors.array(),
        formData: req.body,
      });
    }

    try {
      const { name, email, password, phone } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.render("auth/register", {
          title: "Register - Meja Kita Online",
          errors: [{ msg: "Email already registered" }],
          formData: req.body,
        });
      }

      // Create new user
      const user = await User.create({
        name,
        email,
        password,
        phone: phone || null,
        role: "user",
      });

      // Set session
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      res.redirect("/user/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      res.render("auth/register", {
        title: "Register - Meja Kita Online",
        errors: [{ msg: "Something went wrong. Please try again." }],
        formData: req.body,
      });
    }
  }
);

// POST /auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    res.redirect("/");
  });
});

module.exports = router;
