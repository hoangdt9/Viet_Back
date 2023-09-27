const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const merchantSchema = new mongoose.Schema({
    account: {type: String, required: true},
    name: {type: String, required: true},
    password: {type: String, select: false},
    // superior: {
    //     type: String, 
    //     enum: ['directly under superior'], 
    //     default: 'directly under superior'
    // },
    approvalStatus: {type: String, enum: ['Not reviewed', 'Audited'], default: "Audited"},
    accountStatus: {type: String, enum: ['normal', 'freeze']},
    paymentRate: {type: Number, default: 0},
    availableBalance: {type: Number, default: 500000},
    generateKey: {type: String, required: true}
}, {timestamps: true});

merchantSchema.pre('save', async function(next) {
    //Only run this function if password was modified
    if (!this.isModified('password')) return next();

    //Hash the password with a cost of 10
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

merchantSchema.methods.correctPassword = async(candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword);
}


module.exports = {
    Merchant: mongoose.model('merchants', merchantSchema)
};
