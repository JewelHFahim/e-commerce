const Cart = require("../models/Cart");
const AppError = require("../utils/AppError");

// Get cart items for the logged-in user
async function handleGetCart(req, res, next) {
  try {
    const userId = req.user?._id;

    if (!userId) {
      // Guest user - return empty cart
      return res.status(200).json({
        status: true,
        message: "Guest cart",
        data: { items: [], cartTotal: 0 }
      });
    }

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "cartItems.product",
      select: "name discountPrice imageUrls",
    });
    // const cart = await Cart.findOne({ user: userId }).populate("cartItems.product");

    if (!cart) {
      return res.status(200).json({ status: true, message: "No cart found for this user", data: null });
    }

    const cartItemsWithTotal = cart.cartItems.map((item) => {
      const itemTotal = item.quantity * item.product.discountPrice;
      return { ...item.toObject(), itemTotal }
    })

    const cartTotal = cartItemsWithTotal.reduce((sum, item) => sum + item.itemTotal, 0);

    res.status(200).json({
      status: true,
      message: "Cart fetched successfully",
      data: { cartItems: cartItemsWithTotal, cartTotal },
    });

  } catch (error) {
    next(error);
  }
}

//Add to cart
async function handleAddTocart(req, res, next) {
  try {
    const userId = req.user._id;
    const { product, quantity, size } = req.body;

    if (!product || !quantity) {
      return next(new AppError("Please provide all required fields", 400));
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, cartItems: [] });
    }

    const index = cart.cartItems.findIndex(
      (item) => item.product.toString() === product && item.size === size
    );

    if (index > -1) {
      cart.cartItems[index].quantity += quantity;
    } else {
      cart.cartItems.push({ product, quantity, size });
    }

    await cart.save();

    const populatedCart = await Cart.findOne({ user: userId }).populate(
      "cartItems.product",
      "name discountPrice"
    );

    const cartItemsWithTotal = populatedCart?.cartItems?.map((item) => {
      const itemTotal = item.quantity * item.product.discountPrice;
      return { ...item.toObject(), itemTotal };
    });

    const cartTotal = cartItemsWithTotal.reduce((sum, item) => sum + item.itemTotal, 0);

    res.status(201).json({
      status: true,
      message: "Product added to cart successfully",
      data: { items: cartItemsWithTotal, cartTotal },
    });
  } catch (error) {
    next(error);
  }
}

// Remove single from cart
async function handleSingleRemoveFromCart(req, res, next) {

  try {
    const { productId } = req.params;
    const { size } = req.body;

    if (!size) {
      return next(new AppError("Size is required to remove item", 400));
    }

    const cart = await Cart.findOne({ user: req?.user?._id });

    if (!cart) return next(new AppError("Cart not found", 404));

    const index = cart.cartItems.findIndex((item) => (item.product.toString() === productId && item.size === size));

    if (index === -1) {
      return next(new AppError("Item not found in cart", 404))
    }

    if (cart.cartItems[index].quantity > 1) {
      cart.cartItems[index].quantity -= 1;
    } else {
      cart.cartItems.splice(index, 1)
    }

    await cart.save();

    res.status(200).json({ status: true, message: "Product removed from cart successfully", data: cart });
  } catch (error) {
    next(error);
  }
}

// Remove item from cart
async function handleRemoveItemFromCart(req, res, next) {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    if (!userId) {
      return next(new AppError("User not found", 404));
    }

    if (!productId) {
      return next(new AppError("Product ID is required", 400));
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return next(new AppError("Cart not found", 404));
    }

    const index = cart.cartItems.findIndex((item) => item.product.toString() === productId);

    if (index === -1) {
      return next(new AppError("Item not found in cart", 404));
    }

    cart.cartItems.splice(index, 1);
    await cart.save();

    res.status(200).json({ status: true, message: "Item removed from cart successfully", data: cart });

  } catch (error) {
    next(error)
  }
}

// DELETE /api/cart/clear
async function handleClearCart(req, res, next) {
  try {
    if (!req.user || !req.user._id) {
      return next(new AppError("User not found", 404));
    }
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(200).json({ status: true, message: "Cart cleared" });
  } catch (error) {
    next(error);
  }
}

// POST /api/cart/sync
async function syncCartFromClient(req, res, next) {
  try {
    const user = req.user?._id;

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const { items } = req.body;

    if (!Array.isArray(items)) {
      return next(new AppError("Invalid cart format", 400));
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, cartItems: items });
    } else {
      // Merge new items with existing
      for (const incomingItem of items) {
        const index = cart.cartItems.findIndex(
          (item) =>
            item.product.toString() === incomingItem.product &&
            item.size === incomingItem.size
        );

        if (index > -1) {
          cart.cartItems[index].quantity += incomingItem.quantity;
        } else {
          cart.cartItems.push(incomingItem);
        }
      }
    }

    await cart.save();

    res.status(200).json({ status: true, message: "Cart synced", cart });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  handleGetCart,
  handleAddTocart,
  handleSingleRemoveFromCart,
  handleClearCart,
  syncCartFromClient,
  handleRemoveItemFromCart
};
