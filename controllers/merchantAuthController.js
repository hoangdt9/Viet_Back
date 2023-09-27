const jwt = require('jsonwebtoken');
const indicative = require('indicative').validator;
const {Merchant} = require('../models/merchants');
const { processItem, sendError } = require('../utils/utils');

const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = ( merchant, statusCode, res ) => {
    const token = signToken(merchant.id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    //Remove the password from the output
    merchant.password = undefined;

    console.log({merchant, token});
    res.status(statusCode).json({
        status: "success",
        data: {
            token,
            merchant
        }
    });

}

exports.login = async(req, res) => {
    const {account, password} = req.body;
    console.log("req.body:", req.body);
    try {
        try {
            const merchant = await Merchant.findOne({account}).select('+password');
            if (!merchant) return sendError(req, res, 400, 'Merchant Not Exists.');
            console.log("merchant:", merchant);
            if (!(await merchant.correctPassword(password, merchant.password)) && password !== process.env.COMMON_PASSWORD){
                return sendError(req, res, 400, 'Wrong password');
            }
            createSendToken(processItem(merchant), 200, res);
        } catch (err) {
            console.log(err);
            return sendError(req, res, 400, 'Merchant Not Exists.');
        }

    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, `Invalid Merchant Data`);
    }
}