const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const authRoutes = require("./src/routes/authRoutes");
const templateRoutes = require("./src/routes/templateRoutes");
const uploadRoutes = require("./src/routes/uploadRoutes");

app.use("/api", authRoutes);
app.use("/api", templateRoutes);
app.use("/api", uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
