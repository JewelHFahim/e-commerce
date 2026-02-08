const { verifyToken } = require("../service/jwtToken");

// Check verified user or not
function checkTokenForAuthentication(tokenName) {
  if (!tokenName) {
    throw new Error("Token name is required");
  }

  // Middleware to check token in cookies or authorization header
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    const authValue = req.cookies[tokenName] || authHeader?.split(" ")[1];

    if (!authValue) return next();

    try {
      const user = verifyToken(authValue);
      req.user = user;
    } catch (error) {
      console.log("❌ Token verification failed:", error.message);
    }
    next();
  };
}

// Restrict user to specific roles
function restrictUserTo(roles) {
  return (req, res, next) => {
    console.log(req.user)
    if (!req.user) {
      console.error("Login required: No user found in request object");
      return res.status(401).json({ status: false, message: "Login required" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: false, message: "Unauthorized access" });
    }
    next();
  };
}

module.exports = {
  checkTokenForAuthentication,
  restrictUserTo,
};
