const express = require("express");
const {
  handleCreateOrder,
  handleGetAllAdminOrders,
  handleGetUserOrders,
  handleUpdateOrderStatus,
  handleDeleteOrder,
  handleGetOrderById,
} = require("../controllers/orderController");
const { restrictUserTo } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", handleCreateOrder);
router.get("/", restrictUserTo(["admin"]), handleGetAllAdminOrders);
router.get("/:id", handleGetOrderById);
router.put("/:id", restrictUserTo(["admin"]), handleUpdateOrderStatus);
router.delete("/:id", restrictUserTo(["admin"]), handleDeleteOrder);
router.get("/user", handleGetUserOrders);
router.get("/user/:id", handleGetOrderById);

module.exports = router;
