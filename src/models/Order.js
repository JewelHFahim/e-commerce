const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        size: { type: String, enum: [30, 32, 34, 36, 38, 40, 42, 44], required: true },
        quantity: { type: Number, required: true, min: 1 },
        totalPrice: { type: Number, required: true },
      },
    ],

    shippingAddress: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      phone_number: { type: String, required: true },
    },
    isPaid: { type: Boolean, default: false },
    totalCost: { type: Number, required: true },
    trackingId: { type: String, required: true, unique: true },
    shippingCharge: {type: Number, required: true, default: 0},
    paymentMethod: { type: String, enum: ["Cash", "Card", "Online"], default: "Cash" },
    orderStatus: { type: String, enum: ["Pending", "Shipped", "Delivered"], default: "Pending" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
