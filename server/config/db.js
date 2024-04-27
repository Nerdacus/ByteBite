// mongoose is the library that allows us to interact with mongoDB
const mongoose = require("mongoose");

//connects to the database
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // log the connection in the database
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
