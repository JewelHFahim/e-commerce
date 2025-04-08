
const errorHandler = require("../middlewares/errorHandler");
const Order = require("../models/Order");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");

// Ordrer Controller
async function handleCreateOrder(req, res, next) {
  try {
    const userId = req.user?._id || req.body.userId;
    if (!userId) {
      return next(new AppError("User ID is required.", 400));
    }

    const {
      orderItems,
      shippingAddress,
      shippingCharge = 70,
      isPaid,
      paymentMethod,
      orderStatus,
    } = req.body;

    // Validate required fields
    if (
      !orderItems ||
      orderItems.length === 0 ||
      !shippingAddress?.address ||
      !shippingAddress?.city
    ) {
      return next(new AppError("All fields are required.", 400));
    }

    let totalCost = shippingCharge;
    const updatedOrderItems = [];

    // Loop through each item to validate and calculate price
    for (const item of orderItems) {
      const productDetails = await Product.findById(item.product);
      if (!productDetails) {
        return next(new AppError(`Product not found: ${item.product}`, 404));
      }

      // Check stock availability
      if (productDetails.stockQuantity < item.quantity) {
        return next(
          new AppError(
            `Not enough stock for product ${productDetails.name}`,
            400
          )
        );
      }

      // Calculate total price dynamically
      const totalPrice = item.quantity * productDetails.discountPrice;
      totalCost += totalPrice;

      // Reduce stock after order placement
      productDetails.stockQuantity -= item.quantity;
      await productDetails.save();

      // Store updated order items
      updatedOrderItems.push({
        product: item.product,
        size: item.size,
        quantity: item.quantity,
        totalPrice,
      });
    }

    // Create new order
    const newOrder = await Order.create({
      user: userId,
      orderItems: updatedOrderItems,
      shippingAddress,
      shippingCharge,
      totalCost,
      isPaid: isPaid || false,
      paymentMethod: paymentMethod || "Cash",
      orderStatus: orderStatus || "Pending",
    });

    return res.status(201).json({
      status: true,
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error("Failed to create order:", error);
    next(error);
  }
}

// Get all orders for admin
async function handleGetAllAdminOrders(req, res, next) {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product", "name price");
    return res.status(200).json({
      status: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    next(errorHandler);
  }
}

// Get all orders for user
async function handleGetUserOrders(req, res, next) {
  try {
    const userId = req.user?._id || req.body.userId;
    if (!userId) {
      return next(new AppError("User ID is required.", 400));
    }

    const orders = await Order.find({ user: userId }).populate(
      "orderItems.product",
      "name price"
    );
    return res.status(200).json({
      status: true,
      message: "User orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    next(errorHandler);
  }
}

// Get order by ID for user
async function handleGetOrderById(req, res, next) {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return next(new AppError("Order ID is required.", 400));
    }

    const order = await Order.findById(orderId)
      .populate("user", "name email")
      .populate("orderItems.product", "name price");
    if (!order) {
      return next(new AppError("Order not found.", 404));
    }

    return res.status(200).json({
      status: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error("Failed to fetch order:", error);
    next(errorHandler);
  }
}

// Update order status
async function handleUpdateOrderStatus(req, res, next) {
  try {
    const orderId = req.params.id;
    const { orderStatus } = req.body;

    if (!orderId || !orderStatus) {
      return next(new AppError("Order ID and status are required.", 400));
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );
    if (!updatedOrder) {
      return next(new AppError("Order not found.", 404));
    }

    return res.status(200).json({
      status: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Failed to update order status:", error);
    next(errorHandler);
  }
}

// Delete order by ID
async function handleDeleteOrder(req, res, next) {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return next(new AppError("Order ID is required.", 400));
    }

    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return next(new AppError("Order not found.", 404));
    }

    return res.status(200).json({
      status: true,
      message: "Order deleted successfully",
      data: deletedOrder,
    });
  } catch (error) {
    console.error("Failed to delete order:", error);
    next(errorHandler);
  }
}

//  async function createCheckoutSession(req, res){
//   const userId = req.user?._id || req.body.userId;

//   const line_items = [...Array(2)].map((item) => ({
//     price_data: {
//       currency: "usd",
//       product_data: {
//         name: `ProductName (Size: 2)`,
//         images: "https://example.com/image.png",
//       },
//       unit_amount: Math.round(15 * 100), // in cents
//     },
//     quantity: 7,
//   }));

//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items,
//       mode: "payment",
//       success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_URL}/cart`,
//       metadata: { userId },
//     });

//     res.json({ id: session.id });
//   } catch (err) {
//     console.error("Stripe Session Error:", err.message);
//     res.status(500).json({ message: "Stripe session creation failed" });
//   }
// };

module.exports = {
  handleCreateOrder,
  handleGetAllAdminOrders,
  handleGetUserOrders,
  handleGetOrderById,
  handleUpdateOrderStatus,
  handleDeleteOrder,
};
