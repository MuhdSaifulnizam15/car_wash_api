const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { toJSON } = require("./plugins");
const { orderSchema } = require('./order.model');
const { freebieSchema } = require('./freebie.model');

const salesSchema = mongoose.Schema(
  {
    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    barber_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    order: [orderSchema],
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    total: {
      type: String,
      default: 0
    },
    rewarded_points: {
      type: String,
      default: 0
    },
    car_plate: {
      type: String
    },
    freebie: [freebieSchema],
  },
  {
    timestamps: true,
  }
);

salesSchema.plugin(toJSON);
salesSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Sale", salesSchema);
