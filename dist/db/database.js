"use strict";

const mongoose = require("mongoose");

mongoose.set("debug", true);

const log = require("debug")("log");

require("dotenv").config();

const connectDB = () => {
  console.log("Connecting to database...");
  mongoose.connect(process.env.DB_URL, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }).then(() => {
    log("Connected to API Database!");
  }).catch(error => {
    console.error.bind(console, `MongoDB Connection Error>> : ${error}`);
  });
};

module.exports = {
  connectDB
};