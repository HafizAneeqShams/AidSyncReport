const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },   // e.g. "Abstract"
  content: { type: String, default: "" },      // text content
  order: { type: Number, default: 0 }          // sidebar order
}, { timestamps: true });

module.exports = mongoose.model("Section", sectionSchema);