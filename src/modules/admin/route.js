const express = require("express");
const router = express.Router();

const normalizeEmailInBody = require("../../middleware/normalizeEmailInBody.js");
const adminController = require("./controller.js");

router.post("/register", normalizeEmailInBody, adminController.register);
router.post("/login", normalizeEmailInBody, adminController.login);

module.exports = router;
