const express = require("express");

// Debug environment variables
console.log("=== ENVIRONMENT DEBUG ===");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "***SET***" : "NOT SET");
console.log(
  "SESSION_SECRET:",
  process.env.SESSION_SECRET ? "***SET***" : "NOT SET"
);
console.log("PORT:", process.env.PORT);
console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
console.log(
  "ADMIN_PASSWORD:",
  process.env.ADMIN_PASSWORD ? "***SET***" : "NOT SET"
);
console.log("=========================");

// Check if express-ejs-layouts is available
try {
  const expressLayouts = require("express-ejs-layouts");
  console.log("✅ express-ejs-layouts loaded successfully");
} catch (error) {
  console.log("❌ express-ejs-layouts failed to load:", error.message);
}

// Check if views directory exists
const fs = require("fs");
const path = require("path");

const viewsPath = path.join(__dirname, "views");
if (fs.existsSync(viewsPath)) {
  console.log("✅ Views directory exists at:", viewsPath);

  const layoutPath = path.join(viewsPath, "layout.ejs");
  if (fs.existsSync(layoutPath)) {
    console.log("✅ Layout.ejs exists");
  } else {
    console.log("❌ Layout.ejs not found");
  }
} else {
  console.log("❌ Views directory not found");
}

// Start normal server
require("./server.js");
