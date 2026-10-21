const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth/authController");

router.post("/login", authController.adminLogin);

module.exports = router;
