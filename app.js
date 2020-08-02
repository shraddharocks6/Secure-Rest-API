const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//ROUTE IMPORT
const Routes = require("./routes/routes.config.js");

const app = express();
//DATABASE CONNECTION
mongoose.connect(
  "mongodb+srv://webapp:wegottawin@cluster0.4gzmr.mongodb.net/SECURE-REST-API?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("We are connected to cloud");
});

//ROUTE MIDDLEWARES
app.use(Routes);

//LISTENING
// app.listen(process.env.PORT, process.env.IP);
app.listen(3000, () => console.log("Server is on!!"));
