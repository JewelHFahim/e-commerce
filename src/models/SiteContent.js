const mongoose = require("mongoose");

// Define the schema for the slider
const sliderSchema = new mongoose.Schema({
  title: String,
  imageUrl: String,
  link: String,
  order: Number,
  isActive: { type: Boolean, default: true },
  description: String,
});

const Slider = mongoose.model("slider", sliderSchema);

// models/Settings.ts
const settingsSchema = new mongoose.Schema({
  contactEmail: String,
  contactPhone: String,
  address: String,
  facebookUrl: String,
  twitterUrl: String,
  youtubeUrl: String,
  logoUrl: String,
});

const Settings = mongoose.model("setting", settingsSchema);

// models/News.ts
const newsSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const News = mongoose.model("news", newsSchema);

module.exports = { Slider, Settings, News };
