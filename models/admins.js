const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userid: { type: String, required: true },
    userType: { type: String, enum: ['admin'], default: 'admin' },
    account:{ type: String, required: true },
    password: {type: String, select: false}
}, {timestamps: true});

adminSchema.pre('save', async function(next){
    //Only run this function if password was modified
    if (!this.isModified('password')) return next();

    //Hash the password with a cost of 10
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

adminSchema.methods.correctPassword = async function (candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
}

adminSchema.pre('updateOne', async function(next) {

    //Hash the password with a cost of 10
    const salt = bcrypt.genSaltSync(10);
    this._update.password = await bcrypt.hash(this._update.password, salt);

    next();
});

module.exports = mongoose.model('admins', adminSchema);