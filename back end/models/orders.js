const mongoose = require("mongoose");

const schema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "name must not be empty"],
  },
  date: {
    type: String,
    required: true,
  },
  cookPhone: {
    type: Number,
  },
  driverPhone: {
    type: Number,
  },
  userPhone: {
    type: Number,
    required: true,
  },
  cook: {
    type: String,
  },
  driver: {
    type: String,
  },
  status: {
    type: String,
  },
  user: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderModel = mongoose.model("orders", schema);

module.exports = orderModel;
