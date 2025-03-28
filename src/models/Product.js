const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    currentPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      default: null,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    availableSizes: {
      type: [String],
      required: true,
      default: [],
    },

    imageUrls: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.every((url) => typeof url === "string");
        },
        message: "All images must be valid URLs",
      },
    },

    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
