const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET = process.env.JWT_SECRET || "ecommerce@123";

function generateToken(user) {
  const payload = { _id: user._id, role: user.role };
  const token = jwt.sign(payload, SECRET, { expiresIn: "3d" });
  return token;
}

function verifyToken(token) {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, SECRET);
    return payload;
  } catch (error) {
    throw new Error("Invalid Token");
  }
}

module.exports = {
  generateToken,
  verifyToken,
};