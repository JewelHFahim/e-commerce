const express = require("express");
const authRouter = require("./authRoutes");
const productRouter = require("./productRoutes");
const orderRouter = require("./orderRoutes");
const cartRouter = require("./cartRoutes");
const siteContentRouter = require("./siteContentRoutes");

const router = express.Router();

router.use("/users", authRouter);
router.use("/products", productRouter);
router.use("/orders", orderRouter);
router.use("/carts", cartRouter);
router.use("/site", siteContentRouter);

module.exports = router;
