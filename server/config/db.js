const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  try {
    if (!isConnected) {
      mongoose.set("strictQuery", false);
      const conn = await mongoose.connect(process.env.MONGODB_URI);

      //Connection doesn't exist
      console.log(`Database Connected: ${conn.connection.host}`);

      isConnected = true;
    } else {
      //Connection exists
      console.log("Database connection already established.");
    }
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};

module.exports = connectDB;
