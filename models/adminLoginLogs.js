const mongoose = require('mongoose');

const adminLoginLogSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId, ref: 'admins'},
    ip: { type: String, required: true },
    location: { type: String, default: 'unknown' }
}, {timestamps: true});

const adminOperationLog = new mongoose.Schema({
    adminId: {type: mongoose.Schema.Types.ObjectId, ref: 'admins'},
    ipAddress: {type: String},
    broswer: {type: String},
    CPU: {type: String, default: 'amd'},
    device: {type: String, default: 'unknown'},
    OS: {type: String},
    interface: {type: String, required: true},
    parameters: Object,
    result: Object
}, {timestamps: true}); 

module.exports = {
    AdminLoginLog: mongoose.model("adminLoginLogs", adminLoginLogSchema),
    AdminOpeartionLog: mongoose.model("adminOperationLogs", adminOperationLog)
}