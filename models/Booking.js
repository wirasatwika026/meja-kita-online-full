const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bookingDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: new Date().toISOString().split("T")[0], // Cannot book past dates
      },
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    guestCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 20,
      },
    },
    specialRequests: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
      defaultValue: "pending",
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    tableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tables",
        key: "id",
      },
    },
  },
  {
    tableName: "bookings",
    timestamps: true,
    validate: {
      endTimeAfterStartTime() {
        if (this.startTime >= this.endTime) {
          throw new Error("End time must be after start time");
        }
      },
    },
  }
);

module.exports = Booking;
