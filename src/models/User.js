const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../service/jwtToken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    address: {
      street: { type: String },
      city: { type: String },
      country: { type: String },
      postalCode: { type: String },
    },

    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
      required: true,
    },

    // orders: [{ type: mongoose.Schema.Types.ObjectId, ref: Order }],
    orders: [],
  },
  {
    timestamps: true,
  }
);

// Password hashing
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  next();
});

//Find By Credentials
userSchema.static("findByCredentials", async function (email, password) {
  try {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Password is inccorect");

    // Generate token
    const token = generateToken(user);

    return { token };
  } catch (error) {
    console.log("Failed to create user", error);
    throw error;
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
