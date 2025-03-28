const { verifyToken } = require("../service/jwtToken");

// Check verified user or not
function checkTokenForAuthentication(tokenName) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader.startsWith("Bearer ")) {
      return next();
    }

    const authValue = req.cookies[tokenName] || authHeader.split(" ")[1];
    if (!authValue) return next();

    try {
      const user = verifyToken(authValue);
      req.user = user;
    } catch (error) {
      res
        .status(401)
        .json({ status: false, message: "Invalid or Expired Token" });
      next();
    }

    next();
  };
}

function restrictUserTo(roles) {
  return (req, res, next) => {
    if (!req.user) {
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
  restrictUserTo
};
