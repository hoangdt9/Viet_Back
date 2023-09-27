const { Order } = require('../models/orders');
const { sendError, logOperation } = require('../utils/utils');
const mongoose = require('mongoose');
let { DebitCard } = require('../models/debitCards');

exports.getAllOrders = async(req, res) => {
    try {
        let orders = await Order.find({status: {$in: ['unPaid']}}).populate('merchantId');
        await logOperation(req, orders);
        console.log(orders);
        return res.json({success: true, orders});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, 'Server Error');
    }
}

exports.getOrderInfo = async(req, res) => {
    try {
        let count = await Order.find().count();
        await logOperation(req, {count: count});
        return res.json({success: true, count});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, 'Server Error');
    }
}

exports.getOrdersByPage = async(req, res) => {
    let { count, page } = req.params;
    try {
        let orders = await Order.find({status: {$in: ['paid', 'unPaid']}})
        .sort({createdAt: -1})
        .skip((page - 1) * count)
        .limit(count)
        .populate('merchantId');
        await logOperation(req, orders);
        return res.json({success: true, orders});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invaild Info');
    }
}

exports.getOrdersByStatus = async(req, res) => {
    let {status} = req.params;
    try {
        let orders = await Order.find({status}).populate('merchantId');
        await logOperation(req, orders);
        return res.json({success: true, orders});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, 'Server Error');
    }
}

exports.addOrder = async(req, res) => {
    // let merchantId = new  mongoose.Types.ObjectId('6469d24c0378b9d151a7beeb')
    // let merchantId = '6469d24c0378b9d151a7beeb';
    let { merchantId, totalAmount, payAmount, 
        payMethod, notifyUrl,  backUrl, bankCode,
        bankAccountName, bankMemo, is_revise_wrong_amount,
        sign, merchant, receiptNumber,
        status } = req.body;
        console.log("req.body:", req.body);
    let outTradeNo = 0;
    try {
        let orderCount = await Order.find().count();
        outTradeNo = orderCount + 1;
        console.log("orderCount:", orderCount);

        let order = await Order.create({
            merchantId: new mongoose.Types.ObjectId(merchantId), 
            outTradeNo, 
            orderAmount: totalAmount,
            payAmount, 
            payMethod, notifyUrl, backUrl, bankCode, bankAccountName,
            bankMemo, is_revise_wrong_amount, sign, merchant, receiptNumber,
            status,
            ipAddress: req.socket.remoteAddress
        });

        let debitCard = await DebitCard.findOne({checked: true  });
        if (debitCard) {
            let orders = [];
            orders.push(order);
            global.io.emit('orders', {debitCard, orders});
        }
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Order Info');
    }

}

exports.requestRefund = async(req, res) => {
    let { orderId, refundedReason } = req.body;
    try {
        await Order.findOneAndUpdate({_id: orderId}, {refundedReason, status: "refunded"});
        return res.json({ success: true })
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid ID')
    }
}

exports.getAllRefundingOrders = async(req, res) => {
    try {
        let refundingOrders = await Order.find({status: "refunded"}).populate('merchantId');
        await logOperation(req, refundingOrders);
        return res.json({success: true, refundingOrders});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, 'Server Error');
    }
}

exports.modifyPaymentAmount = async(req, res) => {
    let { id,  orderAmount } = req.body;
    console.log("req.body:", req.body);
    try {
        await Order.findOneAndUpdate({_id: id}, {orderAmount, paymentAmount:orderAmount});
        return res.json({ success: true })
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Payment Amount')
    }
}