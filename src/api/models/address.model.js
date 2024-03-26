const mongoose = require("mongoose");
const { toJSON } = require("./plugins");

const addressSchema = mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postcode: {
    type: String,
    required: true,
  },
  office_no: {
    type: String,
  },
});

addressSchema.plugin(toJSON);

module.exports = mongoose.model("Address", addressSchema);
