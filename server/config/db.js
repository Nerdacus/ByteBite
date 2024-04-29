const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  try {
    if (!isConnected) {
      mongoose.set("strictQuery", false);
      const conn = await mongoose.connect(process.env.MONGODB_URI);

      // Log the connection in the database
      console.log(`Database Connected: ${conn.connection.host}`);

      isConnected = true;
    } else {
      // Print a message indicating that the connection already exists
      console.log("Database connection already established.");
    }
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

module.exports = connectDB;
