const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

function connectdb() {
  mongoose.connect(MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  const connection = mongoose.connection;
  connection.on("connected", () => {
    console.log("MongoDb is connection successful");
  });
  connection.on("error", () => {
    console.log("Mongo DB connection error");
  });
}

module.exports = connectdb;
