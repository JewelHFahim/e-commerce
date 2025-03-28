const jwt = require("jsonwebtoken");
const SECRET = "ecommerce@123";

function generateToken(user) {
  const payload = { _id: user._id, role: user.role };
  const token = jwt.sign(payload, SECRET, { expiresIn: "3d" });
  return token;
}

function verifyToken(token) {
  if (!token) return null;
  const payload = jwt.verify(token, SECRET);
  return payload;
}

module.exports = {
  generateToken,
  verifyToken,
};