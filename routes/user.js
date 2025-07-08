const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { User, Booking, Table } = require("../models");

const router = express.Router();

// Apply middleware to all user routes
router.use(requireAuth);

// GET /user/dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const userId = req.session.user.id;

    const userBookings = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: Table,
          as: "table",
          attributes: ["tableNumber", "capacity", "location"],
        },
      ],
      order: [
        ["bookingDate", "DESC"],
        ["startTime", "DESC"],
      ],
      limit: 10,
    });

    const upcomingBookings = userBookings.filter(
      (booking) =>
        new Date(booking.bookingDate) >= new Date().setHours(0, 0, 0, 0) &&
        booking.status !== "cancelled"
    );

    res.render("user/dashboard", {
      title: "My Dashboard - Meja Kita Online",
      user: req.session.user,
      recentBookings: userBookings,
      upcomingBookings,
    });
  } catch (error) {
    console.error("User dashboard error:", error);
    res.render("error", {
      title: "Error",
      message: "Failed to load dashboard",
      error: {},
    });
  }
});

// GET /user/profile
router.get("/profile", async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user.id);

    res.render("user/profile", {
      title: "My Profile - Meja Kita Online",
      user,
      errors: [],
      success: false,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.render("error", {
      title: "Error",
      message: "Failed to load profile",
      error: {},
    });
  }
});

// POST /user/profile
router.post("/profile", async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByPk(req.session.user.id);

    await user.update({ name, phone });

    // Update session
    req.session.user.name = name;

    res.render("user/profile", {
      title: "My Profile - Meja Kita Online",
      user,
      errors: [],
      success: true,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    const user = await User.findByPk(req.session.user.id);
    res.render("user/profile", {
      title: "My Profile - Meja Kita Online",
      user,
      errors: [{ msg: "Failed to update profile" }],
      success: false,
    });
  }
});

// GET /user/bookings
router.get("/bookings", async (req, res) => {
  try {
    const userId = req.session.user.id;

    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: Table,
          as: "table",
          attributes: ["tableNumber", "capacity", "location"],
        },
      ],
      order: [
        ["bookingDate", "DESC"],
        ["startTime", "DESC"],
      ],
    });

    res.render("user/bookings", {
      title: "My Bookings - Meja Kita Online",
      bookings,
    });
  } catch (error) {
    console.error("User bookings error:", error);
    res.render("error", {
      title: "Error",
      message: "Failed to load bookings",
      error: {},
    });
  }
});

// POST /user/bookings/:id/cancel
router.post("/bookings/:id/cancel", async (req, res) => {
  try {
    const userId = req.session.user.id;
    const booking = await Booking.findOne({
      where: {
        id: req.params.id,
        userId: userId,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if booking can be cancelled
    if (booking.status === "cancelled" || booking.status === "completed") {
      return res.status(400).json({ error: "Booking cannot be cancelled" });
    }

    // Check if booking date is in the future
    if (new Date(booking.bookingDate) <= new Date()) {
      return res.status(400).json({ error: "Cannot cancel past bookings" });
    }

    await booking.update({ status: "cancelled" });
    res.redirect("/user/bookings");
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});

module.exports = router;
