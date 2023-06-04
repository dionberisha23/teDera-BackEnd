const mongoose = require("mongoose");

const schema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "name must not be empty"],
  },
  price: {
    type: Number,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
});

const cartModel = mongoose.model("cart", schema);

module.exports = cartModel;
