const express = require("express");
const { handleCreateProduct, handleGetAllProducts, handleDeleteProduct, handleGetSingleProduct } = require("../controllers/productController");
const { restrictUserTo } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", handleCreateProduct);
router.get("/", handleGetAllProducts);
router.delete("/:id", restrictUserTo(["admin"]), handleDeleteProduct);
router.get("/:id", handleGetSingleProduct);

module.exports = router;
