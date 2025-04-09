const express = require("express");

const router = express.Router();
const {
  handleGetSliders,
  handleCreateSlider,
  handleGetSettings,
  handleUpdateSettings,
  handleCreateSettings,
  handleUpdateSlider,
  handleGetNews,
  handleCreateNews,
  handleUpdateNews,
} = require("../controllers/siteContentController");

router.get("/sliders", handleGetSliders);
router.post("/sliders", handleCreateSlider);
router.put("/sliders/:id", handleUpdateSlider);

router.get("/news", handleGetNews);
router.post("/news", handleCreateNews);
router.put("/news/:id", handleUpdateNews);

router.post("/settings", handleCreateSettings);
router.get("/settings", handleGetSettings);
router.put("/settings", handleUpdateSettings);

module.exports = router;
