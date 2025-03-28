const express = require("express");
const authRouter = require("./authRoutes");
const productRouter = require("./productRoutes");

const router = express.Router();

router.use("/users", authRouter);
router.use("/products", productRouter);

module.exports = router;
