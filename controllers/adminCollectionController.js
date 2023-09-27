const { Gate, Label, CollectionCard, RollOver } = require('../models/collection');
const { sendError, logOperation } = require('../utils/utils');
const Transaction = require('../models/transactions');
const Screenshot = require('../models/screenshots');


exports.getAllGates = async( req, res ) => {
    try {
        let gates = await Gate.find();
        await logOperation(req, gates);
        return res.json({success: true, gates});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, 'Server Error');
    }
}


exports.addGate = async(req, res) => {
    let { channel, merchants, payment_device,   collection_time_from, collection_time_to, probability, delayed_collection, receipt_amount_from, receipt_amount_to } = req.body;
    try {
        await Gate.create({channel, merchants, payment_device,   collection_time_from, collection_time_to, probability, delayed_collection, receipt_amount_from, receipt_amount_to});
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Gate Info');
    }
}

exports.modifyGate = async(req, res) => {
    let { id, channel, merchants, payment_device,  collection_time_from, collection_time_to, probability, delayed_collection, receipt_amount_from, receipt_amount_to } = req.body;
    console.log(req.body);
    try {
        let gate = await Gate.findOneAndUpdate({_id: id}, {channel, merchants, payment_device,   collection_time_from, collection_time_to, probability, delayed_collection, receipt_amount_from, receipt_amount_to});
        await logOperation(req, gate);
        return res.json({success: true, gate});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Gate Info');
    }
}

exports.deleteGate = async(req, res) => {
    let { id } = req.params;
    try {
        await Gate.deleteOne({ _id : id });
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Gate ID');
    }
}

exports.addLabel = async(req, res) => {
    let { caption, color } = req.body;
    try {
        await Label.create({caption, color});
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Label Info');
    }
}

exports.deleteLabel = async (req, res) => {
    let { id } = req.params;
    try {
        await Label.deleteOne({ _id : id });
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Label ID');
    }
};

exports.getAllLabels = async(req, res) => {
    try {
        let labels = await Label.find();
        await logOperation(req, labels);
        return res.json({success: true, labels});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, 'Server Error');
    }
}

exports.getAllCollectionCardsByType = async(req, res) => {
    let { cardType } = req.params;
    try {
        let cards = await CollectionCard.find({cardType: cardType});
        await logOperation(req, cards);
        return res.json({success: true, cards});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, 'Server Error');
    }
}

exports.searchByClassification = async(req, res) => {
    let { cardType, classification } = req.body;
    try {
        let cards = await CollectionCard.find({classification, cardType});
        await logOperation(req, cards);
        return res.json({success: true, cards});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Collection Card');
    }
}


exports.addCollectionCard = async(req, res) => {
    let { name, type, paymentType, accountNumber, phoneNumber, bank, cardType} = req.body;
    console.log("req.body:", req.body);
    try {
        await CollectionCard.create({
            name, type, paymentType, accountNumber, cardType,
            phoneNumber, bank
        });
        await logOperation(req);
        return res.json({success: true});

    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Collection Card');
    }

}

exports.modifyCollectionCard = async (req, res) => {
    let { id, name, type, labels, 
        deviceID, ordinalValue, dailyReceivingLimit, dailyMaxPayment,
        state, classification, weights, crawlerStatus
    } = req.body;
    try {
        await CollectionCard.findOneAndUpdate({_id: id}, {name, type, labels, 
            deviceID, ordinalValue, dailyReceivingLimit, dailyMaxPayment,
            state, classification, weights, crawlerStatus});
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Collection Card')
    }
};

exports.changeState = async(req, res) => {
    let { id, state } = req.body;
    console.log("changeState:", req.body);
    try {
        await CollectionCard.findOneAndUpdate({_id: id}, {state});
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Collection Card');
    }
}


exports.changeCrawlerStatus = async(req, res) => {
    let { id, crawlerStatus } = req.body;
    try {
        await CollectionCard.findOneAndUpdate({_id: id}, {crawlerStatus});
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Collection Card');
    }
}

exports.deleteCollectionCard = async(req, res) => {
    let { id } = req.params;
    try {
        await CollectionCard.deleteOne({ _id : id });
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid CollectionCard Info');
    }
}

exports.registRollOver = async(req, res) => {
    let { collectionCardId,  banking, bankName, deviceNumber, 
        bankAccount, bankPassword, OTP, targetBankName,
        collectionAccount, amount, appointedToPay
    } = req.body;
    try {
        if (collectionCardId){
            await CollectionCard.findOneAndUpdate({_id: collectionCardId}, 
                {
                banking, bankName, deviceNumber, 
                bankAccount, bankPassword, OTP, targetBankName,
                collectionAccount, amount, appointedToPay
            });
            global.io.emit('initRollOver', {
                bankType: targetBankName,
                account: collectionAccount,
                amount: amount,
                appointedToPay: appointedToPay 
            });
        }
        else {
            await RollOver.findOneAndUpdate({banking}, {
                bankName, deviceNumber, 
                bankAccount, bankPassword, OTP, targetBankName,
                collectionAccount, amount, appointedToPay
            });
        }
      
        await logOperation(req);
        return res.json({success: true});

    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Rollover Info');
    }
}

exports.getRollOverByBanking = async(req, res) => {
    let banking = 'online banking';
    try {
        let rollOver = await RollOver.findOne({banking});
        await logOperation(req, rollOver);

        return res.json({ success: true, rollOver});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid RollOver Info');
    }
}

exports.getRollOverByCollectionId = async(req, res) => {
    let { collectionId } = req.params;
    try {
        let rollOver = await CollectionCard.findOne({_id: collectionId});
        // let rollOver = await RollOver.findOne({collectionCardId: collectionId});
        await logOperation(req, rollOver);
        return res.json({ success: true, rollOver});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid RollOver Info');
    }
}

exports.saveRestrictMerchants = async(req, res) => {
    let { id, restrictMerchants } =req.body;
    try {
        let collectionCard = await CollectionCard.findOne({_id: id});
        collectionCard.restrictMerchants = restrictMerchants;
        await collectionCard.save();
        return res.json({ success: true });    
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Collection Card ID ');
    }
}

exports.setAlarm = async(req, res) => {
    const { id, alarmStdValue, alarmStatus} = req.body;
    try {
        await CollectionCard.findOneAndUpdate({_id: id}, {alarmStdValue, alarmStatus});
        if (alarmStatus){
            global.io.emit('stdValue', { type: 'BankCard', value:alarmStdValue});
        }
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Collection Card');
    }
}

exports.getAllTransactions = async(req, res) => {
    try {
        let transactions = await Transaction.find();
        await logOperation(req, transactions);
        return res.json({success: true, transactions});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, 'Server Error');
    }
}

exports.getAllScreenshots = async(req, res) => {
    try {
        let screenshots = await Screenshot.find({ transactionId: {"$exists": false} });
        console.log("screenshots:", screenshots);
        return res.json({success: true, screenshots});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, 'Server Error');
    }
}

exports.setTransIdInScreenshot = async(req, res) => {
    let { screenshotId, transactionId } = req.body;
    console.log("req.body:", req.body);
    try {
        let screenshot = await Screenshot.findOneAndUpdate({ _id: screenshotId }, { transactionId: transactionId });
        let transaction = await Transaction.findOneAndUpdate({ _id: transactionId }, { filename: screenshot.filename });
        if (transaction.filename) {
            await Screenshot.findOneAndUpdate({ filename: transaction.filename }, { $unset: {transactionId: 1} });
        }
        return res.json({success:true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Information');
    }
}

// exports.removeTransIdInSreenshot = async(req, res) => {
//     let { transactionId } = req.body;
//     try {
//         let transaction = await Transaction.findOne({ _id: transactionId });
//         transaction.transactionId = null;
//         await Screenshot.findOneAndUpdate({ _id: screenshotId }, { transactionId: null });
//         return res.json({success:true});
//     } catch (err) {
//         console.log(err);
//         return sendError(req, res, 400, 'Invalid Information');
//     }
// }

// global.io.on('test', (data) => {
//     console.log("data:", data);
// })

