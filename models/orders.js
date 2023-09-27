const mongoose = require('mongoose');
/**
 * 
 *  VNBANK: Vietnam bank transfer card
    VNDIRECT: Vietnam online banking direct connection
    VNBANKQR: Vietnamese online banking scan code
    VNZALO: Vietnam ZALO pay
    VNMOMO: Vietnam MOMO pay
    VNVTPAY: Vietnam ViettelPay
 */


const orderSchema = new mongoose.Schema({
    merchantId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'merchants'},
    outTradeNo: {type: String, required: true}, // Merchant order number, must be a unique order number.
    orderAmount: {type: Number, required: true}, // For the order amount, please contact customer service for the specific limit.
    category: String,
    paymentAmount: Number,

    payMethod: { // channel coding
        type: String,
        // enum: ["VNBANK", "VNDIRECT", "VNBANKQR", "VNZALO", "VNMOMO", "VNVTPAY"],
        default: "VNBANK"
    },
    notifyUrl: { type: String, required: true }, //Payment result callback URL, when the order arrives successfully, our company will send the payment result
    backUrl: String, // URL redirected after payment
    bankCode: String, //Bank code, required when channel code is VNBANK, VNBANKQR, VNDIRECT
    bankAccountName: String, // Payer's name, optional, only for checking the score
    bankMemo: {type: String, default: '1072821'},
    smsContent: {type: String, default: 'SMS Assistant automatically forwarded from: Techcombank Time: 2021-10-27 03:12:56 Content: TK 19037155539013 So tien GD: 270000 So du: 1427450 Thanh toan QR 1072821'},
    ipAddress: {type: String, default: 'XXX.XXX.XXX.XXX'},
    is_revise_wrong_amount: { type: Number, enum: [0, 1], default: 0 },
    sign: String,
    notificationStatus: { type: String, enum : ['no receipt', 'receipt'], default: 'no receipt' },
    receiptNumber: String,
    status: {type :String, enum: ['paid', 'unPaid', 'filling', 'refunded', 'dropped'], default: 'unPaid'},
    refundedReason: String
}, {timestamps: true});

const fillingSchema = new mongoose.Schema({
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: 'merchants'},
    amount: { type: Number, required: true},
    chargeRate: { type: Number, required: true},
    remark: String
}, {timestamps: true});

// const refundSchema = new mongoose.Schema({

// });

// const dropSchema = new mongoose.Schema({

// });


module.exports = {
    Order: mongoose.model('orders', orderSchema),
    Filling: mongoose.model('fillings', fillingSchema),
    // Refund: mongoose.model('refunds', refundSchema),
    // Drop: mongoose.model('drops', dropSchema)
}
