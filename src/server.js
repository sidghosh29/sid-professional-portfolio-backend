require("dotenv").config(); // Loads environment variables from .env file

const connectDB = require("./config/db");

const app = require("./app");

const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: "*", // you can restrict later
      },
    });

    // make io accessible in controllers
    app.set("io", io);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
})();
