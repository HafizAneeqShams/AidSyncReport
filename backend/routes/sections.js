const express = require("express");
const router = express.Router();
const Section = require("../models/Section");

// Sirf data fetch karne ke liye
router.get("/", async (req, res) => {
  try {
    const sections = await Section.find().sort({ order: 1 });
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;