const express = require("express");
const jwt = require("jsonwebtoken");
const KaalkaNTP = require("./KaalkaNTP");

const app = express();
const kaalkaNTP = new KaalkaNTP();

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

// Encrypt endpoint
app.post("/encrypt", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretKey", (err) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const data = req.body.data;
      const encryptedData = kaalka.encrypt(data);
      res.json({ encryptedData });
    }
  });
});

// Decrypt endpoint
app.post("/decrypt", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretKey", (err) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const encryptedData = req.body.encryptedData;
      const decryptedData = kaalka.decrypt(encryptedData);
      res.json({ decryptedData });
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
