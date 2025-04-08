const Stripe = require("stripe");

const stripe = new Stripe(
  "sk_test_51M6RfEDZfW4raXLHO2Z1slgQ3533z1UvveBNB7BDsM1RwDafVdgqzTuN8DQPrLNGkblIre5mRA7fs4rvHhgBlnH500Ibu939nk",
  {
    apiVersion: "2022-11-15",
  }
);

module.exports = stripe;
