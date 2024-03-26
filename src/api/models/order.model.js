const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const orderSchema = mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  quantity: {
    type: String,
    default: 1,
  },
});

module.exports = {
  orderSchema,
};
