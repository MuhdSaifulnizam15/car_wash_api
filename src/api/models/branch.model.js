const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { toJSON } = require('./plugins');

const branchSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    }
});

branchSchema.plugin(toJSON);
branchSchema.plugin(mongoosePaginate);

branchSchema.statics.isNameTaken = async function (name, excludeBranchId) {
    const city = await this.findOne({ name, _id: { $ne: excludeBranchId }});
    return !!city;
};

module.exports = mongoose.model('Branch', branchSchema);