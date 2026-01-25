const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "MediGo backend running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
