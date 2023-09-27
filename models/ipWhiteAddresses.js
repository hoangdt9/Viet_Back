const mongoose = require('mongoose');

const ipWhiteAdressSchema = new mongoose.Schema({
    ipAddress: {type: String, required: true},
    merchantId: {type:mongoose.Schema.Types.ObjectId, ref: 'merchants'}
}, {timestamps: true});

module.exports = mongoose.model('ipWhiteAddresses', ipWhiteAdressSchema);
