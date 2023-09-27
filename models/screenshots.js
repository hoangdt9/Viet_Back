const mongoose = require('mongoose');

const screenshotSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    transactionId: {type: String, ref: 'transactions'},
}, {timeseries: true});

module.exports = mongoose.model('screenshots', screenshotSchema);