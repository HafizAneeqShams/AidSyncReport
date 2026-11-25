require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const sectionRoutes = require("./routes/sections");

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/api/sections", sectionRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => console.log(`Server on http://localhost:${process.env.PORT}`));
  })
  .catch(err => console.error(err));