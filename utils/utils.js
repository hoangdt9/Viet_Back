const { AdminOpeartionLog } = require('../models/adminLoginLogs')
const Admin = require('../models/admins');

exports.logOperation = async(req, result = {}) => {
    // console.log("req.headers:", req.headers);
    let admin = await Admin.find();
    let { headers } = req;
    let ipAddress = req.socket.remoteAddress;


    await AdminOpeartionLog.create({
        adminId: admin[0]._id,
        broswer: headers.broswer,
        ipAddress,
        device: headers.device,
        interface: req.originalUrl,
        parameters: {...req.params, ...req.body},
        result: Array.isArray(result) ? result: [result] 
    });

}

exports.sendError = ( req, res, statusCode, message, err) => {
    if ( req.app.get('env') === 'development'){
        res.status(statusCode || 500).json({
            message: message || err.message,
            error: err || {}
        });
    } else {
        res.status(statusCode || 500).json({
            message: message || err.message,
            error: {}
        });
    }
}

exports.processItem = (obj) => {
    var bk = obj.toObject();
    bk.id = bk._id;
    delete bk._id;
    return bk;
}