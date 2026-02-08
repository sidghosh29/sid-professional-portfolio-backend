const express = require("express");
const router = express.Router();

const clientController = require("./controller.js");

router.get("/", clientController.getClients);

router.post("/", clientController.createClient);

module.exports = router;
