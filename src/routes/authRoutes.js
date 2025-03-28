const express = require("express");
const {
  handleRegistration,
  handleLogin,
  handleUserList,
  handleGetSingleUser,
  handleDeleteUser,
} = require("../controllers/authController");

const router = express.Router();

router.post("/auth/registration", handleRegistration);
router.post("/auth/login", handleLogin);
router.get("/", handleUserList);
router.get("/:id", handleGetSingleUser);
router.delete("/:id", handleDeleteUser);

module.exports = router;
