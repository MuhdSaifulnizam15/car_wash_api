const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { toJSON } = require("./plugins");

const bookingSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone_no: {
      type: String,
      required: true
    },
    car_plate: {
      type: String,
      required: true
    },
    status: {
      type: String,
    },
    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

bookingSchema.plugin(toJSON);
bookingSchema.plugin(mongoosePaginate);

bookingSchema.statics.isActiveCarPlateOrder = async function (car_plate, excludeServiceId) {
  const service = await this.findOne({ car_plate, status: { $ne: 'completed' }, _id: { $ne: excludeServiceId } });
  return !!service;
};

module.exports = mongoose.model("Booking", bookingSchema);
