const express = require("express");
const { body, validationResult } = require("express-validator");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { User, Table, Booking } = require("../models");
const { Op } = require("sequelize");

const router = express.Router();

// Apply middleware to all admin routes
router.use(requireAuth, requireAdmin);

// GET /admin/dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: "user" } });
    const totalTables = await Table.count();
    const totalBookings = await Booking.count();
    const todayBookings = await Booking.count({
      where: {
        bookingDate: new Date().toISOString().split("T")[0],
      },
    });

    const recentBookings = await Booking.findAll({
      include: [
        { model: User, as: "user", attributes: ["name", "email"] },
        { model: Table, as: "table", attributes: ["tableNumber"] },
      ],
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    res.render("admin/dashboard", {
      title: "Admin Dashboard - Meja Kita Online",
      stats: {
        totalUsers,
        totalTables,
        totalBookings,
        todayBookings,
      },
      recentBookings,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.render("error", {
      title: "Error",
      message: "Failed to load dashboard",
      error: {},
    });
  }
});

// GET /admin/tables
router.get("/tables", async (req, res) => {
  try {
    const tables = await Table.findAll({
      order: [["tableNumber", "ASC"]],
    });

    res.render("admin/tables", {
      title: "Manage Tables - Admin",
      tables,
    });
  } catch (error) {
    console.error("Tables error:", error);
    res.render("error", {
      title: "Error",
      message: "Failed to load tables",
      error: {},
    });
  }
});

// GET /admin/tables/new
router.get("/tables/new", (req, res) => {
  res.render("admin/table-form", {
    title: "Add New Table - Admin",
    table: {},
    errors: [],
    isEdit: false,
  });
});

// POST /admin/tables
router.post(
  "/tables",
  [
    body("tableNumber").notEmpty().withMessage("Table number is required"),
    body("capacity")
      .isInt({ min: 1, max: 20 })
      .withMessage("Capacity must be between 1 and 20"),
    body("pricePerHour")
      .isFloat({ min: 0 })
      .withMessage("Price must be a valid positive number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("admin/table-form", {
        title: "Add New Table - Admin",
        table: req.body,
        errors: errors.array(),
        isEdit: false,
      });
    }

    try {
      await Table.create(req.body);
      res.redirect("/admin/tables");
    } catch (error) {
      console.error("Create table error:", error);
      res.render("admin/table-form", {
        title: "Add New Table - Admin",
        table: req.body,
        errors: [
          { msg: "Failed to create table. Table number might already exist." },
        ],
        isEdit: false,
      });
    }
  }
);

// GET /admin/tables/:id/edit
router.get("/tables/:id/edit", async (req, res) => {
  try {
    const table = await Table.findByPk(req.params.id);
    if (!table) {
      return res.status(404).render("404", { title: "Table Not Found" });
    }

    res.render("admin/table-form", {
      title: "Edit Table - Admin",
      table,
      errors: [],
      isEdit: true,
    });
  } catch (error) {
    console.error("Edit table error:", error);
    res.render("error", {
      title: "Error",
      message: "Failed to load table",
      error: {},
    });
  }
});

// PUT /admin/tables/:id
router.post(
  "/tables/:id",
  [
    body("tableNumber").notEmpty().withMessage("Table number is required"),
    body("capacity")
      .isInt({ min: 1, max: 20 })
      .withMessage("Capacity must be between 1 and 20"),
    body("pricePerHour")
      .isFloat({ min: 0 })
      .withMessage("Price must be a valid positive number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("admin/table-form", {
        title: "Edit Table - Admin",
        table: { ...req.body, id: req.params.id },
        errors: errors.array(),
        isEdit: true,
      });
    }

    try {
      const table = await Table.findByPk(req.params.id);
      if (!table) {
        return res.status(404).render("404", { title: "Table Not Found" });
      }

      await table.update(req.body);
      res.redirect("/admin/tables");
    } catch (error) {
      console.error("Update table error:", error);
      res.render("admin/table-form", {
        title: "Edit Table - Admin",
        table: { ...req.body, id: req.params.id },
        errors: [{ msg: "Failed to update table" }],
        isEdit: true,
      });
    }
  }
);

// DELETE /admin/tables/:id
router.post("/tables/:id/delete", async (req, res) => {
  try {
    const table = await Table.findByPk(req.params.id);
    if (!table) {
      return res.status(404).json({ error: "Table not found" });
    }

    await table.destroy();
    res.redirect("/admin/tables");
  } catch (error) {
    console.error("Delete table error:", error);
    res.status(500).json({ error: "Failed to delete table" });
  }
});

// GET /admin/bookings
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: User, as: "user", attributes: ["name", "email", "phone"] },
        { model: Table, as: "table", attributes: ["tableNumber", "capacity"] },
      ],
      order: [
        ["bookingDate", "DESC"],
        ["startTime", "DESC"],
      ],
    });

    res.render("admin/bookings", {
      title: "Manage Bookings - Admin",
      bookings,
    });
  } catch (error) {
    console.error("Bookings error:", error);
    res.render("error", {
      title: "Error",
      message: "Failed to load bookings",
      error: {},
    });
  }
});

// POST /admin/bookings/:id/status
router.post("/bookings/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await booking.update({ status });
    res.redirect("/admin/bookings");
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({ error: "Failed to update booking status" });
  }
});

// GET /admin/users
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: "user" },
      order: [["createdAt", "DESC"]],
    });

    res.render("admin/users", {
      title: "Manage Users - Admin",
      users,
    });
  } catch (error) {
    console.error("Users error:", error);
    res.render("error", {
      title: "Error",
      message: "Failed to load users",
      error: {},
    });
  }
});

// POST /admin/users/:id/toggle-status
router.post("/users/:id/toggle-status", async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent deactivating admin users
    if (user.role === "admin") {
      return res.status(400).json({ error: "Cannot modify admin user status" });
    }

    await user.update({ isActive: isActive === "true" });
    res.redirect("/admin/users");
  } catch (error) {
    console.error("Toggle user status error:", error);
    res.status(500).json({ error: "Failed to update user status" });
  }
});

module.exports = router;
