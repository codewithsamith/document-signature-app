const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

/* BODY PARSER */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/* AUTH ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);

/* 🔐 PROTECTED ROUTE — WRITE HERE */
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed protected route 🔐",
    userId: req.user.id,
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.error(err));

app.get("/", (req, res) => {
  res.send("API Running Successfully 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});