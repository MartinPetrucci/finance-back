const connectionString = require("./Constants");
const mongoose = require("mongoose");

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error(err);
  });
