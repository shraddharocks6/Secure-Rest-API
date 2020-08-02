const express = require("express"),
  router = express.Router();

const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const User = require("../models/user.js");

router.get("/api", (req, res) => {
  res.json({ message: "Get Request" });
});

router.post("/api/post", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretKey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({ message: "Post created", authData });
    }
  });
});

router.post("/api/login/:email/:password", (req, res) => {
  const user = {
    id: 1,
    username: "sam",
    password: "sam12",
  };
  //ABOVE HAS TO BE RETURNED BY THE DATABASE
  jwt.sign({ user: user }, "K", (err, token) => {
    res.json({
      token: token,
    });
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    //Get Token from Array
    const bearerToken = bearer[1];
    req.token = bearerToken;

    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = router;
