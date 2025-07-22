const express = require("express");
const {
  handleCreateProduct,
  handleGetAllProducts,
  handleDeleteProduct,
  handleGetSingleProduct,
} = require("../controllers/productController");
const { restrictUserTo } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

const router = express.Router();

router.post("/", upload.array("images", 5), handleCreateProduct);
router.get("/", handleGetAllProducts);
router.delete("/:id", restrictUserTo(["admin"]), handleDeleteProduct);
router.get("/:id", handleGetSingleProduct);

module.exports = router;
