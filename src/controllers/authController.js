const User = require("../models/User");
const AppError = require("../utils/AppError");

// Registration
async function handleRegistration(req, res, next) {
  const { name, email, phone, password, address } = req.body;

  try {
    // Validate Required Fields
    if (!name || !email || !phone || !password) {
      return next(new AppError("All fields are required", 400));
    }

    // Check Email or Phone already exist
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return next(new AppError("Email or Phone already exist", 409));
    }

    // Create new user
    await User.create({
      name,
      email,
      phone,
      password,
      address,
      role: "customer",
    });

    return res
      .status(201)
      .send({ status: true, message: "registration success" });
  } catch (error) {
    next(error);
  }
}

// Login User
async function handleLogin(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Email & Password required", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Verify user
    try {
      const { token } = await User.findByCredentials(email, password);

      return res
        .cookie("token", token)
        .status(201)
        .send({ status: true, message: "Login success", token });
    } catch (authError) {
      if (authError === "Password is inccorect") {
        return next("Password is incorrect", 401);
      }
      throw authError;
    }
  } catch (error) {
    next(error);
  }
}

// Update user
async function handleUpdateUser(req, res){
  try {
    const { id } = req.params;

    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({ status: false, message: "Invalid user ID" });
    // }

    const allowedFields = ["name", "email", "phone", "address"];
    const updates = {};

    for (let key of allowedFields) {
      if (req.body[key]) {
        updates[key] = req.body[key];
      }
    }

    // Prevent password updates here
    if (req.body.password) {
      return res.status(400).json({ status: false, message: "Use /update-password to change password" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password"); // never return password

    if (!updatedUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    return res.status(200).json({
      status: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// User List
async function handleUserList(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const totalUsers = await User.countDocuments({});
    const totalPages = Math.ceil(totalUsers / limit);

    if (totalUsers === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No products found", data: [] });
    }

    const users = await User.find({})
      .select("-password")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    if (users.length === 0) {
      return next(new AppError("No users found", 404));
    }

    return res.status(200).json({
      status: true,
      message: "User list retrieved",
      data: { users, totalUsers, totalPages, currentPage: page },
    });
  } catch (error) {
    next(error);
  }
}

// Single user
async function handleGetSingleUser(req, res, next) {
  try {
    const id = req.user._id ? req.user : req.params;

    if (!id) {
      return next(new AppError("User ID is required", 400));
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).send({ status: true, message: "User found", user });
  } catch (error) {
    next(error);
  }
}

// Delete user
async function handleDeleteUser(req, res, next) {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) return next(new AppError("User not found", 404));

    res.status(200).send({ status: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
}

// Logout useer
async function handleLogoutUser(req, res, next) {
  try {
    res.clearCookie("token").status(200).send({ status: true, message: "Logout success" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  handleRegistration,
  handleUpdateUser,
  handleUserList,
  handleLogin,
  handleGetSingleUser,
  handleDeleteUser,
  handleLogoutUser,
};
