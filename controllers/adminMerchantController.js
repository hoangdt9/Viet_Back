const { Merchant } = require('../models/merchants');
const { sendError, logOperation } = require('../utils/utils');
const { Filling } = require('../models/orders');

exports.getAllMerchants = async(req, res) => {
    try {
        let merchants = await Merchant.find();
        await logOperation(req, merchants);
        return res.json({success: true, merchants});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, 'Server Error');
    }
};

exports.modifyMerchant = async(req, res) => {
    let { id, account } = req.body;
    try {
        let merchant = await Merchant.findOneAndUpdate({_id: id}, {account});
        await logOperation(req, merchant);
        return res.json({success: true, merchant});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Merchant Info');
    }
};

exports.registMerchant = async(req, res) => {
    let { name, account, password } = req.body;
    let secretKey = generateKey();
    console.log("secretKey:", secretKey);

    try {
        await Merchant.create({ name, account, password, secretKey });
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Merchant Info');
    }
};

const generateKey = () => {
    let key = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      key += characters.charAt(randomIndex);
    }
    
    return key;
}

exports.deleteMerchant = async(req, res) => {
    let { id } = req.params;
    try {
        await Merchant.deleteOne({ _id : id });
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Merchant Info');
    }
}

exports.changeAccountStatus = async(req, res) => {
    let { id, accountStatus} = req.body;
    try {
        let merchant = await Merchant.findOneAndUpdate({_id: id}, {accountStatus});
        await logOperation(req, merchant);
        return res.json({success: true, merchant});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Merchant Info');
    }
} 

exports.setInnerFilling = async(req, res) => {
    let { merchantId, amount, chargeRate, remark } = req.body;
    try {
        let merchant = await Merchant.findById(merchantId);
        await merchant.updateOne({availableBalance: merchant.availableBalance + amount})
        await Filling.create({
            merchantId, amount, chargeRate, remark
        });
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Filling Info');
    }
}

exports.getAllFillings = async(req, res) => {
    try {
        let Fillings = await Filling.find().populate('merchantId');
        await logOperation(req, Fillings);
        return res.json({ success: true, Fillings});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, 'Server Error');
    }
}





