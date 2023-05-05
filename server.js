const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.DB_URI;
const connection = mongoose.connect(uri);

connection
  .then(() => {
    console.log("Database connection successul");
    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  })
  .catch((err) => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });
