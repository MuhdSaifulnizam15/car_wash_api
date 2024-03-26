const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { toJSON } = require("./plugins");

const customerSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    phone_no: {
      type: String,
      required: true,
      unique: true,
    },
    total_membership_point: {
      type: String,
      default: 0
    },
    total_redeemed_point: {
      type: String,
      default: 0
    },
    total_spend: {
      type: String,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

customerSchema.plugin(toJSON);
customerSchema.plugin(mongoosePaginate);

customerSchema.statics.isPhoneNumberTaken = async function (
  phone_no,
  excludeCustomerId
) {
  const customer = await this.findOne({
    phone_no,
    _id: { $ne: excludeCustomerId },
  });
  return !!customer;
};

module.exports = mongoose.model("Customer", customerSchema);
