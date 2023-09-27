const mongoose = require('mongoose');
const validator = require('validator');

const payment_channel = [
    "Vietnam bank transfer card",
    "Vietnam Online Banking Direct Connection",
    "Vietnam online banking scan code",
    "Vietnam ZALO pay",
    "Vietnam MOMO pay",
    "Vietnam ViettelPay",
    "Philippine GCASH",
    "Philippine GCASH_QR"
]

const payment_bank = [
    "Techcombank",
    "ACB",
    "Vietcombank",
    "Vietinbank",
    "BIDV",
    "Sacombank",
    "Eximbank",
    "MBBank",
    "ABB",
    "DGB",
    "HDB",
    "TPB",
    "SGB",
    "VPB",
    "Agribank",
    "VietCapital",
    "OCB",
    "OTHER"
];

const userSchema = new mongoose.Schema({
    merchantId: {type: Number, required: true},
    name: { type: String, required: true}
},
{timestamps: true});

module.exports = mongoose.model('users', userSchema);