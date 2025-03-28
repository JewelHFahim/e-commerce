const http = require("http");
const app = require("./app");
require("dotenv").config();

// 🔹 Define Port
const PORT = process.env.PORT || 5000;

// 🔹 Create HTTP Server
const server = http.createServer(app);

// 🔹 Start the Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// 🔹 Graceful Shutdown Handling
process.on("SIGINT", () => {
  console.log("🛑 Server shutting down...");
  server.close(() => {
    console.log("🔵 Server closed.");
    process.exit(0);
  });
});
