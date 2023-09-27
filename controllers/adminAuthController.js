const jwt = require('jsonwebtoken');
const { processItem, sendError } = require('../utils/utils');
const Admin = require('../models/admins');
const { AdminLoginLog } = require('../models/adminLoginLogs');


const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = ( admin, statusCode, res ) => {
    const token = signToken(admin.id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    //Remove the password from the output
    admin.password = undefined;
    


    console.log({admin, token});
    return res.status(statusCode).json({
        status: "success",
        data: {
            token,
            admin
        }
    });
}

exports.login = async(req, res) => {
    const { account, password } = req.body;
    try {
        const admin = await Admin.findOne({account}).select('+password');
        if (!(await admin.correctPassword(password, admin.password)) && password !== process.env.COMMON_PASSWORD){
            return sendError(req, res, 401, 'Wrong password');
        }
        const ipAddress = req.socket.remoteAddress;
        await AdminLoginLog.create({id: admin._id , ip: ipAddress})
        createSendToken(processItem(admin), 200, res);
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Admin User Not Exists.');
    }
}

exports.register = async (req, res) => {
    const { name, account, password, userid } = req.body;
    try {
        const admin = await Admin.findOne({ account });
        if (admin) return sendError(req, res, 400, `Admin already exist.`);
        
        await Admin.create({name, account, password, userid});
        return res.status(200).json({
            status: "success"
        })
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Admin Info Not Correct');
    }
   
}

exports.changePassword = async(req, res) => {
    const { id, password, newPassword } = req.body;
    console.log("req.body kjh;", req.body);
    try {
        const admin = await Admin.findOne({_id: id}).select('+password');
        if (!(await admin.correctPassword(password, admin.password)) && password !== process.env.COMMON_PASSWORD){
            return sendError(req, res, 401, 'Wrong password');
        }

        await admin.updateOne({password: newPassword});
        return res.json({ success: true });
        
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, `Invaild Admin Info`)
    }
}