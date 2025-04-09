const { Slider, Settings, News } = require("../models/SiteContent");

// ==================SLIDER CONTROLLERS=================

// Function to get all sliders
async function handleGetSliders(req, res, next) {
  try {
    const sliders = await Slider.find();
    res.status(200).json(sliders);
  } catch (error) {
    next(error);
  }
}

// Function create slider
async function handleCreateSlider(req, res, next) {
  try {
    const { title, description, imageUrl, link, order } = req.body;
    const newSlider = await Slider.create({ title, description, imageUrl, link, order });
    res.status(201).json(newSlider);
  } catch (error) {
    next(error);
  }
}


// Function update slider
async function handleUpdateSlider(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, link, order  } = req.body;
    const newSlider = await Slider.findByIdAndUpdate({_id: id},{ title, description, imageUrl, link, order  },{ new: true });
    res.status(201).json(newSlider);
  } catch (error) {
    next(error);
  }
}

// ==================SETTINGS CONTROLLERS=================
// Function to get all settings
async function handleGetSettings(req, res, next) {
  try {
    const settings = await Settings.find();
    res.status(200).json(settings);
  } catch (error) {
    next(error);
  }
}

//Function create settings
async function handleCreateSettings(req, res, next) {
  try {
    const { contactEmail, contactPhone, address, facebookUrl, twitterUrl, youtubeUrl, logoUrl } = req.body;
    const newSettings = await Settings.create({ contactEmail, contactPhone, address, facebookUrl, twitterUrl, youtubeUrl, logoUrl });
    res.status(201).json(newSettings);
  } catch (error) {
    next(error);
  }
}


// Function to update settings
async function handleUpdateSettings(req, res, next) {
  try {
    const { contactEmail, contactPhone, address, facebookUrl, twitterUrl, youtubeUrl, logoUrl } = req.body;
    const updatedSettings = await Settings.findOneAndUpdate(
      {},
      { contactEmail, contactPhone, address, facebookUrl, twitterUrl, youtubeUrl, logoUrl },
      { new: true }
    );
    res.status(200).json(updatedSettings);
  } catch (error) {
    next(error);
  }
}


// ==================SITE NEWS=================

// Function to get all news
async function handleGetNews(req, res, next) {
  try {
    const news = await News.find();
    res.status(200).json(news);
  } catch (error) {
    next(error);
  }
}

// Function create news
async function handleCreateNews(req, res, next) {
  try {
    const { title, content } = req.body;
    const news = await News.create({ title,content });
    res.status(201).json(news);
  } catch (error) {
    next(error);
  }
}


// Function update news
async function handleUpdateNews(req, res, next) {
  try {
    const { id } = req.params;
    const { title, content} = req.body;
    const news = await News.findByIdAndUpdate({_id: id},{ title, content },{ new: true });
    res.status(201).json(news);
  } catch (error) {
    next(error);
  }
}


module.exports = {
  handleGetSliders,
  handleCreateSlider,
  handleGetSettings,
  handleUpdateSettings,
  handleCreateSettings,
  handleUpdateSlider,
  handleGetNews,
  handleCreateNews,
  handleUpdateNews
};


