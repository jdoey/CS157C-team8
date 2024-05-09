require("dotenv").config();
const mongoose = require("mongoose");

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

let bucket;
database.once("connected", () => {
  console.log("Database Connected");
  bucket = new mongoose.mongo.GridFSBucket(database, {
    bucketName: "photos",
  });
});

database.once("open", () => {
  console.log("Connection open");
});

module.exports = { getBucket: () => bucket };
