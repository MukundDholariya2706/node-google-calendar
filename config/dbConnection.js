require("dotenv").config();
const mongoose = require("mongoose");


const DB_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/google-calendar-event';

mongoose.connect(DB_URL);

mongoose.connection.on("connected", async () => {
  console.log("Database connected!");
});

mongoose.connection.on("error", (err) => {
  console.log("Mongodb Connection failed! ", err);
  mongoose.disconnect();
});

module.exports = mongoose;
