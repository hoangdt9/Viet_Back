const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    bankname: String,
    accountname: String,
    accountnumber: String,
    amount: Number,
    date: {type: Date, default: Date.now},
    transactionId: {type: String},
    filename: String
});

module.exports = mongoose.model('transactions', transactionSchema);