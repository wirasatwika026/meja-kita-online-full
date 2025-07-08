const { sequelize } = require("../config/database");
const User = require("./User");
const Table = require("./Table");
const Booking = require("./Booking");

// Define associations
User.hasMany(Booking, {
  foreignKey: "userId",
  as: "bookings",
});

Booking.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Table.hasMany(Booking, {
  foreignKey: "tableId",
  as: "bookings",
});

Booking.belongsTo(Table, {
  foreignKey: "tableId",
  as: "table",
});

module.exports = {
  sequelize,
  User,
  Table,
  Booking,
};
