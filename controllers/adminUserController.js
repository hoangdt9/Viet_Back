const {AdminLoginLog, AdminOpeartionLog} = require('../models/adminLoginLogs');
const { sendError, logOperation } = require('../utils/utils');


exports.getAdminLogs = async(req, res) => {
    try {
        let logs = await AdminLoginLog.find().sort({createAt: -1}).limit(5);
        await logOperation(req);
        return res.json({success: true, logs});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, `Server Error`);
    }
}
