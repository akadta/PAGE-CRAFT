const express = require("express");

const router = express.Router();

const testController = require("../controllers/testController");

router.get("/testdb", testController.testDb);

module.exports = router;
