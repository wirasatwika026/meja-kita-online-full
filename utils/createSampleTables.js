const Table = require("../models/Table");

async function createSampleTables() {
  try {
    // Check if tables already exist
    const existingTables = await Table.count();

    if (existingTables > 0) {
      console.log("Sample tables already exist");
      return;
    }

    const sampleTables = [
      {
        tableNumber: "T001",
        capacity: 2,
        location: "Window Side",
        description: "Cozy table for two with a beautiful window view",
        pricePerHour: 15.0,
        isAvailable: true,
      },
      {
        tableNumber: "T002",
        capacity: 4,
        location: "Main Hall",
        description: "Perfect family table in the main dining area",
        pricePerHour: 25.0,
        isAvailable: true,
      },
      {
        tableNumber: "T003",
        capacity: 6,
        location: "Garden View",
        description: "Spacious table with garden view for larger groups",
        pricePerHour: 35.0,
        isAvailable: true,
      },
      {
        tableNumber: "T004",
        capacity: 8,
        location: "Private Room",
        description: "Private dining room perfect for business meetings",
        pricePerHour: 50.0,
        isAvailable: true,
      },
      {
        tableNumber: "T005",
        capacity: 2,
        location: "Corner",
        description: "Intimate corner table for romantic dinners",
        pricePerHour: 18.0,
        isAvailable: true,
      },
      {
        tableNumber: "T006",
        capacity: 4,
        location: "Patio",
        description: "Outdoor patio table with fresh air dining",
        pricePerHour: 22.0,
        isAvailable: true,
      },
      {
        tableNumber: "T007",
        capacity: 10,
        location: "Banquet Hall",
        description: "Large table for celebrations and events",
        pricePerHour: 75.0,
        isAvailable: true,
      },
      {
        tableNumber: "T008",
        capacity: 3,
        location: "Bar Area",
        description: "High table near the bar for casual dining",
        pricePerHour: 20.0,
        isAvailable: true,
      },
    ];

    await Table.bulkCreate(sampleTables);
    console.log("Sample tables created successfully");
  } catch (error) {
    console.error("Error creating sample tables:", error);
  }
}

module.exports = { createSampleTables };
