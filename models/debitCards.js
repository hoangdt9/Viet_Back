const mongoose = require('mongoose');

const debitCardSchema = new mongoose.Schema({
    sequence: { type: Number, required: true, default: 1},

    name: {type: String, required: true},
    bankName: {type: String, required: true},
    bankAccount: {type: String, required: true},
    totalDepositAmount: {type: String, default: 0},
    balance: {type: String, default: 0},
    paymentRobot: {type: String, enum: ['closure', 'turn on'], default: 'closure'},
    automaticPayment: {type: Boolean, default: false},
    state: {type: String, enum: ['not connected', 'connected']},
    fee: { type: Number, default: 0}, 
    checked: {type: Boolean, default: false},

    withdrawalType: {type: String, enum: ['only pay', 'only issued', 'all'], default: 'only pay'},
    banking : {type: String , enum: ['hand silver', 'online banking'], default: 'hand silver'},
    TCB_version: {type: String, enum: ['Old APP', 'New APP'], default: 'New APP'},
    dailyWithdrawalLimit: { type: Number, default: 1000000 },
    single_minimum: {type: Number, default: 100000},
    single_maximum: {type: Number, default: 300000},
    lowBalanceAlert: {type: Number, default: 50000},
    loginAccount: {type: String, default: '12345678'},
    loginPassword: {type: String, default: 'password'},
    fixedOTP: { type: String },
    restrictMerchants: [{
        type: mongoose.Schema.Types.ObjectId, ref: "merchants"
    }]
}, {timestamps: true});

const debitCardTransferLogSchema = new mongoose.Schema({
    operator : {type: String, default: 'vincent'},
    cardHolder: { type: String, required: true },
    bankName: { type: String, required: true },
    cardNumber: { type: String, required: true },
    accountName: { type: String, required: true },
    amount: { type: String, required: true },
    handlingFee: { type: String, required: true },
}, {timestamps: true}) 

module.exports = {
    DebitCard: mongoose.model('debitCards', debitCardSchema),
    DebitCardTransferLog: mongoose.model('debitCardTransferLogs', debitCardTransferLogSchema)
}
