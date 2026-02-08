const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/auth.js");
const clientController = require("./controller.js");

router.get("/", clientController.getClients);

router.post("/", authMiddleware, clientController.createClient);

module.exports = router;
