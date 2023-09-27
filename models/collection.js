const mongoose = require('mongoose');

const GateSchema = new mongoose.Schema({
    channel: { type: String, required: true},
    merchants: [{type: String, required: true}],
    payment_device: {type: String, enum: ["Mobile Terminal", "Computer"], default: "computer"},
    // collection_area: { type: String, required: true},
    // payment_method: { type: String, required: true },
    collection_time_from: { type: Date },
    collection_time_to: { type: Date},
    receipt_amount_from: { type: Number },
    receipt_amount_to: { type: Number},
    probability: { type: Number, required: true },
    delayed_collection: { type: Number, required: true },
    // gps_matching: {type: String, enum: ['closure', 'turn on']}
}, {timestamps: true});

const DeviceSchema = new mongoose.Schema({
    name: {type: String, required: true},
    status: String,
    receipt_number: Number
});

const CollectionCardSchema = new mongoose.Schema({
    name: {type: String, required: true},
    type: {type: String, required: true}, //bankName
    labels: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'labels'
    }],
    deviceID: {type: Number, default: 0},
    ordinalValue: {type: Number, default: 1},
    dailyReceivingLimit: {type: Number, default: 200000},
    dailyMaxPayment: {type: Number, default: 1000},
    state: {type: String, enum: ['turn on', 'closure'], default: 'closure'},
    classification: {type: String, enum: ['normal', 'abnormal'], default: 'normal'},
    weights: {type: Number, default: 1},
    receipt_from:  Number,
    receipt_to: Number,
    receipt_limit: {type: Boolean, default: false},
    crawlerStatus: {type: String, enum: ['closure', 'turn on'], default: 'closure'},
    alarmStatus: {type: Boolean, default: false},
    alarmStdValue: Number,
    paymentType: {type: String, required: true},
    accountNumber: String,
    phoneNumber: String,
    bank: String,
    OTP: String,
    cardType: {type: String, enum: ['BankCard', 'Momo', 'ViettelPay', 'Zalo']},
    restrictMerchants: [{type: mongoose.Schema.Types.ObjectId, ref : 'merchants'}],

    banking: { type: String, enum: ['hand silver', 'online banking']}, // "hand silver" : "Mobile", "online banking" : "PC"
    targetBankName: String,
    collectionAccount: {type: String, default: '1911200288'},
    amount: Number,
    appointedToPay: String

});

const LabelSchema = new mongoose.Schema({
    caption: {type: String, required: true},
    color: {type: String, enum: ['red', 'blue', 'orange', 'pink', 'purple'], default: 'red'},
});

const RollOverSchema = new mongoose.Schema({
    collectionCardId: {type: mongoose.Schema.Types.ObjectId, ref: 'collectionCards'},
    banking: { type: String, enum: ['hand silver', 'online banking']}, // "hand silver" : "Mobile", "online banking" : "PC"
    bankName: {type: String, required: true},
    deviceNumber: Number,
    bankAccount: {type: String, required: true},
    bankPassword: {type: String, required: true},
    OTP: {type: String, required: true},
    targetBankName: {type: String, required: true},
    collectionAccount: {type: String, required: true},
    amount: { type: Number, required: true },
    appointedToPay: String,
    status: { type: Boolean, default: false }
});



module.exports = {
    Gate: mongoose.model('gates', GateSchema),
    Device: mongoose.model('devices', DeviceSchema),
    CollectionCard: mongoose.model('collectionCards', CollectionCardSchema),
    Label: mongoose.model('labels', LabelSchema),
    RollOver: mongoose.model('rollovers', RollOverSchema) 
}