const express = require("express");
const {
  handleCreateOrder,
  handleGetAllAdminOrders,
  handleGetUserOrders,
  handleUpdateOrderStatus,
  handleDeleteOrder,
  handleGetOrderById,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", handleCreateOrder);
router.get("/", handleGetAllAdminOrders);
router.get("/:id", handleGetOrderById);
router.put("/:id", handleUpdateOrderStatus);
router.delete("/:id", handleDeleteOrder);
router.get("/user", handleGetUserOrders);
router.get("/user/:id", handleGetOrderById);

module.exports = router;
