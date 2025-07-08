const User = require("../models/User");

async function createDefaultAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: { email: process.env.ADMIN_EMAIL },
    });

    if (!existingAdmin) {
      await User.create({
        name: "Administrator",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: "admin",
        phone: "081234567890",
      });
      console.log("Default admin user created successfully");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error creating default admin:", error);
  }
}

module.exports = { createDefaultAdmin };
