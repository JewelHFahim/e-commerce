const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");
const routes = require("./src/routes/index");
const {
  checkTokenForAuthentication,
} = require("./src/middlewares/authMiddleware");
const errorHandler = require("./src/middlewares/errorHandler");

require("dotenv").config();

const app = express();

// 🔹 Connect to MongoDB
connectDB();

// 🔹 Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkTokenForAuthentication("token"));

// 🔹 Routes
app.get("/", (req, res) => {
  res.send("Server Running Successfully....!!");
});

app.use("/api", routes);

// 🔹 Global Error Handling
app.use(errorHandler);

module.exports = app;
