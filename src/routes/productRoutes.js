const express = require("express");
const { handleCreateProduct, handleGetAllProducts } = require("../controllers/productController");
const router = express.Router();

router.post("/", handleCreateProduct);
router.get("/", handleGetAllProducts);

module.exports = router;
