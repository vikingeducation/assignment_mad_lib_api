const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.json({ name: "Mad Lib API" }));

router.get("*", (req, res) => {
  res.json({ error: "404 Not Found" });
});

module.exports = router;
