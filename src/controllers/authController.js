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
      orders: [],
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

// User List
async function handleUserList(req, res, next) {
  try {
    const users = await User.find({}).select("-password");
    if (users.length === 0) {
      return next(new AppError("No users found", 404));
    }
    return res
      .status(200)
      .json({ status: true, message: "User list retrieved", users });
  } catch (error) {
    next(error);
  }
}

// Single user
async function handleGetSingleUser(req, res, next) {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

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

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).send({ status: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  handleRegistration,
  handleUserList,
  handleLogin,
  handleGetSingleUser,
  handleDeleteUser
};
