const express = require("express");
const {
  handleRegistration,
  handleLogin,
  handleUserList,
  handleGetSingleUser,
  handleDeleteUser,
  handleLogoutUser,
} = require("../controllers/authController");
const { restrictUserTo } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/auth/registration", handleRegistration);
router.post("/auth/login", handleLogin);
router.get("/", restrictUserTo(["admin"]), handleUserList);
router.get("/:id", handleGetSingleUser);
router.delete("/:id", restrictUserTo(["admin"]), handleDeleteUser);
router.post("/logout", handleLogoutUser);

module.exports = router;
