const mongoose = require("mongoose");

async function DbConnect() {
  const DB_URL = process.env.DB_URL;

  try {
    await mongoose.connect(DB_URL, {
      // Removed the deprecated options
      serverSelectionTimeoutMS: 5000,  // Timeout for selecting a server
      socketTimeoutMS: 45000,          // Timeout for socket connections
    });
    console.log('DB connected...');
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1); // Exit if the connection fails
  }

  // Handle connection errors
  mongoose.connection.on("error", (err) => {
    console.error('Mongoose connection error:', err);
  });

  // Handle disconnections
  mongoose.connection.on("disconnected", () => {
    console.log('MongoDB disconnected');
  });
}

module.exports = DbConnect;
