const express = require("express");
const router = express.Router();

const validateContact = require("./validation.js");
const rateLimit = require("../../middleware/rateLimit.js");

const contactController = require("./controller.js");

router.post("/", [rateLimit, validateContact], contactController.contact);

module.exports = router;
