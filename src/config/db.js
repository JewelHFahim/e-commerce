const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ MongoDB connected successfully..!!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }

  // Event Listeners
  mongoose.connection.on("connected", () => {
    console.log("🟢 MongoDB connection established.");
  });

  mongoose.connection.on("error", (err) => {
    console.error("🔴 MongoDB connection error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("🟡 MongoDB disconnected.");
  });

  // Graceful Shutdown on Process Termination
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🔵 MongoDB connection closed due to app termination.");
    process.exit(0);
  });
}

module.exports = connectDB;
