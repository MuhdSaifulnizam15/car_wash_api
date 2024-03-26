const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { toJSON } = require('./plugins');

const staffSchema = mongoose.Schema({
    full_name: {
        type: String,
        required: true,
    },
    phone_no: {
      type: String,
      required: true,
      unique: true,
    },
    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
      required: true
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
}, {
    timestamps: true,
});

staffSchema.plugin(toJSON);
staffSchema.plugin(mongoosePaginate);

staffSchema.statics.isPhoneNumberTaken = async function (phone_no, excludeStaffId) {
    const staff = await this.findOne({ phone_no, _id: { $ne: excludeStaffId } });
    return !!staff;
};

module.exports = mongoose.model('Staff', staffSchema);