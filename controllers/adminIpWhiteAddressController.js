const IpWhiteAddress = require('../models/ipWhiteAddresses');
const { sendError, logOperation } = require('../utils/utils');
const { AdminOpeartionLog } = require('../models/adminLoginLogs')

exports.getIpWhiteAddressList = async(req, res) => {
    try {
        let ipWhiteAddressList = await IpWhiteAddress.find().populate('merchantId');
        await logOperation(req, ipWhiteAddressList);
        return res.json({success: true, ipWhiteAddressList});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, 'Server Error');
    }
};

exports.addIpWhiteAddress = async(req, res) => {
    let { ipAddress, merchantId } = req.body;
    try {
        await IpWhiteAddress.create({ ipAddress, merchantId });
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid ipWhiteAddress Info');
    }
};

exports.modifyIpWhiteAddress = async(req, res) => {
    let { id, ipAddress, merchantId } = req.body;
    try {
        let ipWhiteAddress = await IpWhiteAddress.findOneAndUpdate({_id: id}, {ipAddress, merchantId});
        await logOperation(req);
        return res.json({success: true, ipWhiteAddress});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid ipWhiteAddress Info');
    }
};



exports.deleteIpWhiteAddress = async(req, res) => {
    let { id } = req.params;
    try {
        await IpWhiteAddress.deleteOne({ _id : id });
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid ipWhiteAddress Info');
    }
}




exports.getOperationLogsInfo = async(req, res) => {
    try {
        let count = await AdminOpeartionLog.find().count();
        return res.json({success: true,  count});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, 'Server Error');
    }
}

exports.getOperationLogsByPage = async(req, res) => {
    let { count, page } = req.params;
    try {
        let operationLogList = await AdminOpeartionLog.find()
        .sort({createdAt: -1})
        .skip((page - 1) * count)
        .limit(count)
        .populate('adminId');
        return res.json({success: true, operationLogList});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invaild Info');
    }
}

exports.deleteOperationLog = async(req, res) => {
    let { id } = req.params;
    console.log(req.params);
    try {
        await AdminOpeartionLog.deleteOne({ _id : id });
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid OperationLog Info');
    }
}
