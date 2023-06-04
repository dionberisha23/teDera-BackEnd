const mongoose = require("mongoose");

const schema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "name must not be empty"],
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  cook: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
});

const favoritesModel = mongoose.model("favorites", schema);

module.exports = favoritesModel;
