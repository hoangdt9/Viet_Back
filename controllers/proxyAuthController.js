const jwt = require('jsonwebtoken');
const {Proxy} = require('../models/proxies');
const { processItem, sendError } = require('../utils/utils');

const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const createSendToken = ( proxy, statusCode, res ) => {
    const token = signToken(proxy.id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    //Remove the password from the output
    proxy.password = undefined;

    console.log({proxy, token});
    return res.status(statusCode).json({
        status: "success",
        data: {
            token,
            proxy
        }
    });
}

exports.login = async(req, res) => {
    const { name, password } = req.body;
    try {
        const proxy = await Proxy.findOne({name}).select('+password');
        if (!(await proxy.correctPassword(password, proxy.password)) && password !== process.env.PROXY_COMMON_PASSWORD){
            return sendError(req, res, 401, 'Wrong password');
        }
        createSendToken(processItem(proxy), 200, res);
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Admin User Not Exists.');
    }
};


