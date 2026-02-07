// Import necessary modules and middleware
const express = require("express");

const contactRoutes = require("./modules/contact");
const errorHandler = require("./middleware/errorHandler.js");
const afterRequestHandler = require("./middleware/afterRequestHandler.js");

// Create an Express application
const app = express();

// middleware

// Below is built-in Express middleware to parse JSON bodies.
// It should be used before defining routes that need to access req.body.
app.use(express.json());

// Global middleware that when executes, listens for the 'finish' event on the response object to perform actions after the response has been sent.
app.use(afterRequestHandler);

// routes
app.use("/api/contact", contactRoutes);

// health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// global error handler
app.use(errorHandler);

module.exports = app;
