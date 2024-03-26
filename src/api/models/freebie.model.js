const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const freebieSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    default: 1,
  },
  point: {
    type: String,
    default: 0,
  }
});

module.exports = {
  freebieSchema,
};
