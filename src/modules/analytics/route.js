const express = require("express");
const router = express.Router();

const analyticsController = require("./controller.js");

router.post("/visit", analyticsController.trackVisit);

module.exports = router;
