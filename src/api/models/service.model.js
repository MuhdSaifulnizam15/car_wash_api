const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { toJSON } = require("./plugins");

const serviceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    price: {
      type: String,
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

serviceSchema.plugin(toJSON);
serviceSchema.plugin(mongoosePaginate);

serviceSchema.statics.isNameTaken = async function (name, excludeServiceId) {
  const service = await this.findOne({ name, _id: { $ne: excludeServiceId } });
  return !!service;
};

module.exports = mongoose.model("Service", serviceSchema);
