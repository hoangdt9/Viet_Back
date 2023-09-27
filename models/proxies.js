const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const proxySchema = new mongoose.Schema({
    name: {type: String, required: true},
    account: {type: String, required: true},
    type: {type: String, enum: ['acting'],default: 'acting'},
    password: {type: String, select: false},
    members: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'merchants'
    }],
    rate: [{
        channelType: {type: String, required: true},
        fixedRate: {type: Number, default: 0},
        settlementType: {type: String, required: true}
    }],
    state: {type: String, enum: ['normal', 'freeze'], default: 'normal'}
}, {timestamps: true});

proxySchema.pre('save', async function(next){
    //Only run this function if password was modified
    if (!this.isModified('password')) return next();

    //Hash the password with a cost of 10
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

proxySchema.methods.correctPassword = async(candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword);
}

const ChannelSchema = new mongoose.Schema({
    proxyId: {type: mongoose.Schema.Types.ObjectId, ref: "proxies"},
    channelType: { type: String, required: true},
    channelName: { type: String, required: true },
    rate: { type: Number, required: true},
    state: {type: String, enum: ['opened', 'closure']}
});

module.exports = {
    Proxy: mongoose.model('proxies', proxySchema),
    Channel: mongoose.model('channels', ChannelSchema)
}