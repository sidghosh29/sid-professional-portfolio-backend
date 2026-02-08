// Import necessary modules and middleware
const express = require("express");
const cors = require("cors");
const path = require("path");

const contactRoutes = require("./modules/contact");
const clientRoutes = require("./modules/clients");
const errorHandler = require("./middleware/errorHandler.js");
const afterRequestHandler = require("./middleware/afterRequestHandler.js");

// Create an Express application
const app = express();

// MUST be here (before cors, rateLimit, routes, everything)
app.set("trust proxy", 1);

// ---------- CORS ----------
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:8080",
  "http://localhost:4000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman/curl

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"), false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// ---------- CORS ----------

// Middleware

// Below is built-in Express middleware to parse JSON bodies.
// It should be used before defining routes that need to access req.body.
app.use(express.json());

// Global middleware that when executes, listens for the 'finish' event on the response object to perform actions after the response has been sent.
app.use(afterRequestHandler);

// routes
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/api/contact", contactRoutes);
app.use("/api/clients", clientRoutes);
// health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 404 handler - should be defined after all other routes
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// global error handler
app.use(errorHandler);

module.exports = app;
