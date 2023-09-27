const { DebitCard, DebitCardTransferLog } = require('../models/debitCards');
const { sendError, logOperation } = require('../utils/utils');
const {Order} = require('../models/orders');

exports.getAllDebitCards = async(req, res) => {
    try {
        let debitCards = await DebitCard.find().sort({sequence: 1});
        await logOperation(req);
        return res.json({success: true, debitCards});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, 'Server Error');
    }
}

exports.addDebitCard = async(req, res) => {
    let { name, bankName, bankAccount } = req.body;
    try {
        let debitCard = await DebitCard.findOne({name, bankName, bankAccount});
        if (debitCard) return res.json({success: false, message: "Debit Card already Exists"});
        let count = await DebitCard.find().count();
        await DebitCard.create({sequence: count, name, bankName, bankAccount});
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Card Info');
    }
}

exports.modifyDebitCard = async(req, res) => {
    let { id, name, bankName, bankAccount, balance, fee } = req.body;
    console.log(req.body);
    try {
        let debitCard = await DebitCard.findOneAndUpdate({_id: id}, {name, bankName, bankAccount, balance, fee });
        await logOperation(req);
        return res.json({success: true, debitCard});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Card Info');
    }
}


exports.deleteDebitCard = async(req, res) => {
    let { id } = req.params;
    try {
        await DebitCard.deleteOne({ _id : id });
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Card ID');
    }
}

exports.changePaymentRobot = async(req, res) => {
    let { id, paymentRobot } = req.body;
    try {
        await DebitCard.findOneAndUpdate({ _id: id }, {paymentRobot});
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Card ID');
    }
}

exports.search = async(req, res) => {
    let {name, bankName, bankAccount} = req.body;
    const filters = [];
    filters.push({ name: { "$regex": name, "$options": "i" } });
    filters.push({ bankName: { "$regex": bankName, "$options": "i" } });
    filters.push({ bankAccount: { "$regex": bankAccount, "$options": "i" } });
    
    const main_filter = { $and: filters };
    try {
        let debitCards = await DebitCard.find(main_filter);
        await logOperation(req, debitCards);
        return res.json({ success: true, debitCards });
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, 'Server Error');
    }
}

exports.setWithDrawalSetting = async(req, res) => {
    let { id, withdrawalType, banking, 
        TCB_version, dailyWithdrawalLimit, single_minimum, single_maximum, lowBalanceAlert,
        loginAccount, loginPassword, fixedOTP, restrictMerchants
     } = req.body;
     try {
        let debitCard = await DebitCard.findOneAndUpdate({_id: id}, {
            withdrawalType, banking, 
            TCB_version, dailyWithdrawalLimit, single_minimum, single_maximum, lowBalanceAlert,
            loginAccount, loginPassword, fixedOTP, restrictMerchants
        });
        await logOperation(req);
        return res.json({success: true, debitCard});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid DebitCard Info');
    }
}

exports.changeBalance = async (req, res) => {
    let { id, balance } = req.body;
    try {
        await DebitCard.findOneAndUpdate({ _id: id }, {balance});
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Card ID');
    }
}

exports.changeSequence = async(req, res) => {
    let { selectedCardId, willChangeCardId } = req.body;
    console.log("req.body:", req.body);
    try {
        let selectedCard = await DebitCard.findOne({ _id:selectedCardId });
        let willChangedCard = await DebitCard.findOne({ _id:willChangeCardId });
        let temp1 = selectedCard.sequence;
        let temp2 = willChangedCard.sequence;
        await willChangedCard.updateOne({ sequence: temp1 });
        await selectedCard.updateOne({ sequence: temp2 });
        await logOperation(req);
        return res.json({ success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Card ID');
    }
}

exports.transferBetDebitCards = async(req, res) => {
    let {  fromDebitCardId, toDebitCardId, amount, handlingFee } = req.body;
    try {
        let toDebitCard = await DebitCard.findOne({_id: toDebitCardId});
        let fromDebitCard = await DebitCard.findOne({_id: fromDebitCardId });
        await DebitCardTransferLog.create({
            cardHolder: fromDebitCard.name,
            bankName: toDebitCard.bankName,
            cardNumber: toDebitCard.bankAccount,
            accountName: toDebitCard.name,
            amount,
            handlingFee
        });
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid DebitCard Info');
    }
}

exports.getAllDebitCardTransferLog = async(req, res) => {
    try {
        let debitCardTransferLog = await DebitCardTransferLog.find();
        await logOperation(req, debitCardTransferLog);
        return res.json({success: true, debitCardTransferLog});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, 'Server Error');
    }
}


exports.modifyTransferLog = async(req, res) => {
    let { id, amount, handlingFee } = req.body;
    try {
        await DebitCardTransferLog.findOneAndUpdate({_id: id}, {amount, handlingFee});
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Card ID');
    }
}

exports.deleteTransferLog = async(req, res) => {
    let { id } = req.params;
    try {
        await DebitCardTransferLog.deleteOne({ _id : id });
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Card ID');
    }
}

exports.changeCheckedCard = async(req, res) => {
    let { id, checked } = req.body;
    try {
        let debitCard = await DebitCard.findOneAndUpdate({ _id: id }, {checked});
        await logOperation(req);
        if (checked) {
            let orders = await Order.find({status: {$in: ['unPaid']}})
            global.io.emit('orders', {orders, debitCard});
        }
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Card ID');
    }
}
