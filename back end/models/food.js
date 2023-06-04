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
  phone: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const foodModel = mongoose.model("food", schema);

module.exports = foodModel;
