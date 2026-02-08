const mongoose = require("mongoose");
const Order = require("../src/models/Order");
const Product = require("../src/models/Product");
const Cart = require("../src/models/Cart");
const User = require("../src/models/User");
require("dotenv").config();

async function verifyFix() {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected.");

        // 1. Find a user (or create a dummy one)
        let user = await User.findOne({ email: "test@example.com" });
        if (!user) {
            // limit 1 user
            user = await User.findOne();
        }
        if (!user) {
            console.error("No user found to test with.");
            process.exit(1);
        }
        console.log("Using user:", user._id);

        // 2. Find a product
        const product = await Product.findOne({ stockQuantity: { $gt: 10 } });
        if (!product) {
            console.error("No product with stock found.");
            process.exit(1);
        }
        console.log("Using product:", product.name, product._id);

        // 3. Create a cart for the user
        await Cart.deleteMany({ user: user._id });
        await Cart.create({
            user: user._id,
            cartItems: [{
                product: product._id,
                quantity: 1,
                size: product.availableSizes[0] || "M",
                price: product.discountPrice
            }],
            cartTotal: product.discountPrice
        });
        console.log("Cart created.");

        // 4. Simulate Request Payload
        const reqBody = {
            shippingAddress: {
                name: "Test User",
                address: "123 Test St",
                phone_number: "1234567890"
            },
            shippingCharge: 50,
            paymentMethod: "bKash" // Testing the new enum too!
        };

        // 5. Explicitly call the controller logic? 
        // It's harder to mock req/res. 
        // Instead, I'll just replicate the core transaction logic here to see if it throws WriteConflict
        // OR we can rely on the fact that if we run this script and it succeeds, the DB connection and models are fine.
        // To truly test the controller, we should use a test runner, but here I'll just invoke the controller function if I can mock req/res.

        const { handleCreateOrder } = require("../src/controllers/orderController");

        const req = {
            user: user,
            body: reqBody
        };

        const res = {
            status: (code) => ({
                json: (data) => {
                    console.log(`Response ${code}:`, data);
                }
            })
        };

        const next = (err) => {
            console.error("Next called with error:", err);
        };

        console.log("Calling handleCreateOrder...");
        await handleCreateOrder(req, res, next);

        console.log("Verification finished.");

    } catch (error) {
        console.error("Script failed:", error);
    } finally {
        await mongoose.connection.close();
    }
}

verifyFix();
