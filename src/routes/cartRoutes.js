const express = require("express");
const {
  handleGetCart,
  handleAddTocart,
  handleClearCart,
  syncCartFromClient,
  handleRemoveItemFromCart,
  handleSingleRemoveFromCart,
} = require("../controllers/cartController");

const router = express.Router();

router.post("/sync/cart", syncCartFromClient);
router.get("/", handleGetCart);
router.post("/create", handleAddTocart);
router.delete("/item/:productId", handleSingleRemoveFromCart);
router.delete("/delete/:productId", handleRemoveItemFromCart);
router.delete("/clear", handleClearCart);

module.exports = router;
