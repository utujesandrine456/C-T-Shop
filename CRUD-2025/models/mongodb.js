require("dotenv").config();

const mongoose = require("mongoose");

function connectDB() {
  const url = process.env.MONGODB_URI;

  return mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database connected successfully!"))
    .catch((err) => {
      console.error(`Connection error: ${err.message}`);
      process.exit(1);
    });
}

module.exports = connectDB;
