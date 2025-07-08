const express = require("express");
const { body, validationResult } = require("express-validator");
const { requireAuth } = require("../middleware/auth");
const { Booking, Table, User } = require("../models");
const { Op } = require("sequelize");

const router = express.Router();

// Apply middleware to all booking routes
router.use(requireAuth);

// GET /booking/tables
router.get("/tables", async (req, res) => {
  try {
    const { date, guests } = req.query;

    let whereClause = { isAvailable: true };

    if (guests) {
      whereClause.capacity = { [Op.gte]: parseInt(guests) };
    }

    const tables = await Table.findAll({
      where: whereClause,
      order: [["tableNumber", "ASC"]],
    });

    // If date is provided, filter out tables that are already booked
    let availableTables = tables;
    if (date) {
      const bookedTableIds = await Booking.findAll({
        where: {
          bookingDate: date,
          status: { [Op.in]: ["pending", "confirmed"] },
        },
        attributes: ["tableId"],
        raw: true,
      }).then((bookings) => bookings.map((b) => b.tableId));

      availableTables = tables.filter(
        (table) => !bookedTableIds.includes(table.id)
      );
    }

    res.render("booking/tables", {
      title: "Available Tables - Meja Kita Online",
      tables: availableTables,
      searchDate: date || "",
      searchGuests: guests || "",
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

// GET /booking/new/:tableId
router.get("/new/:tableId", async (req, res) => {
  try {
    const table = await Table.findByPk(req.params.tableId);

    if (!table || !table.isAvailable) {
      return res.status(404).render("404", { title: "Table Not Found" });
    }

    res.render("booking/form", {
      title: "Book Table - Meja Kita Online",
      table,
      errors: [],
      formData: {},
    });
  } catch (error) {
    console.error("Booking form error:", error);
    res.render("error", {
      title: "Error",
      message: "Failed to load booking form",
      error: {},
    });
  }
});

// POST /booking/new/:tableId
router.post(
  "/new/:tableId",
  [
    body("bookingDate")
      .isDate()
      .withMessage("Please select a valid date")
      .custom((value) => {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
          throw new Error("Cannot book for past dates");
        }
        return true;
      }),
    body("startTime").notEmpty().withMessage("Start time is required"),
    body("endTime").notEmpty().withMessage("End time is required"),
    body("guestCount")
      .isInt({ min: 1, max: 20 })
      .withMessage("Guest count must be between 1 and 20"),
    body("specialRequests")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Special requests must be less than 500 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const table = await Table.findByPk(req.params.tableId);

    if (!table) {
      return res.status(404).render("404", { title: "Table Not Found" });
    }

    // Validate time
    const { startTime, endTime } = req.body;
    if (startTime >= endTime) {
      errors.errors.push({ msg: "End time must be after start time" });
    }

    if (!errors.isEmpty()) {
      return res.render("booking/form", {
        title: "Book Table - Meja Kita Online",
        table,
        errors: errors.array(),
        formData: req.body,
      });
    }

    try {
      const { bookingDate, startTime, endTime, guestCount, specialRequests } =
        req.body;

      // Check if table is already booked for this date and time
      const existingBooking = await Booking.findOne({
        where: {
          tableId: req.params.tableId,
          bookingDate,
          status: { [Op.in]: ["pending", "confirmed"] },
          [Op.or]: [
            {
              startTime: { [Op.lte]: startTime },
              endTime: { [Op.gt]: startTime },
            },
            {
              startTime: { [Op.lt]: endTime },
              endTime: { [Op.gte]: endTime },
            },
            {
              startTime: { [Op.gte]: startTime },
              endTime: { [Op.lte]: endTime },
            },
          ],
        },
      });

      if (existingBooking) {
        return res.render("booking/form", {
          title: "Book Table - Meja Kita Online",
          table,
          errors: [
            { msg: "Table is already booked for the selected time slot" },
          ],
          formData: req.body,
        });
      }

      // Calculate total amount (simple calculation: hours * price per hour)
      const startDate = new Date(`2000-01-01T${startTime}`);
      const endDate = new Date(`2000-01-01T${endTime}`);
      const hours = (endDate - startDate) / (1000 * 60 * 60);
      const totalAmount = hours * parseFloat(table.pricePerHour);

      // Create booking
      const booking = await Booking.create({
        userId: req.session.user.id,
        tableId: req.params.tableId,
        bookingDate,
        startTime,
        endTime,
        guestCount,
        specialRequests: specialRequests || null,
        totalAmount,
        status: "pending",
      });

      res.redirect(`/booking/confirmation/${booking.id}`);
    } catch (error) {
      console.error("Booking creation error:", error);
      res.render("booking/form", {
        title: "Book Table - Meja Kita Online",
        table,
        errors: [{ msg: "Failed to create booking. Please try again." }],
        formData: req.body,
      });
    }
  }
);

// GET /booking/confirmation/:id
router.get("/confirmation/:id", async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: {
        id: req.params.id,
        userId: req.session.user.id,
      },
      include: [
        { model: Table, as: "table" },
        { model: User, as: "user" },
      ],
    });

    if (!booking) {
      return res.status(404).render("404", { title: "Booking Not Found" });
    }

    res.render("booking/confirmation", {
      title: "Booking Confirmation - Meja Kita Online",
      booking,
    });
  } catch (error) {
    console.error("Booking confirmation error:", error);
    res.render("error", {
      title: "Error",
      message: "Failed to load booking confirmation",
      error: {},
    });
  }
});

// POST /booking/:id/cancel
router.post("/:id/cancel", async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: {
        id: req.params.id,
        userId: req.session.user.id,
        status: { [Op.in]: ["pending", "confirmed"] },
      },
    });

    if (!booking) {
      return res
        .status(404)
        .json({ error: "Booking not found or cannot be cancelled" });
    }

    await booking.update({ status: "cancelled" });
    res.redirect("/user/bookings");
  } catch (error) {
    console.error("Booking cancellation error:", error);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});

module.exports = router;
