const {Proxy, Channel} = require('../models/proxies');
const {Merchant} = require('../models/merchants');
const { sendError, logOperation } = require('../utils/utils');

exports.getAllProxies = async(req, res) => {
    try {
        let proxies = await Proxy.find().populate('members');
        await logOperation(req, proxies);
        return res.json({success: true, proxies});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, 'Server Error');
    }
}

exports.getProxyInfoById = async(req, res) => {
    let { id } = req.params;
    try {
        let proxy = await Proxy.findById(id).populate('members');
        await logOperation(req, proxy);
        return res.json({success: true, proxy});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 500, 'Server Error');
    }
}

exports.addProxy = async(req, res) => {
    const { account, name, password } = req.body;
    try {
        let proxy = await Proxy.findOne({name});
        if (proxy) return sendError(req, res, 400, 'Proxy User already Exists.')
        await Proxy.create({ account, name, password});
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Proxy User Info Not Correct');
    }
};

exports.addRateInProxy = async(req, res) => {
    const { id, channelType, fixedRate, settlementType } = req.body;
    console.log("req.body:", req.body);
    try {
        let proxy = await Proxy.findById(id);
        proxy.rate.push({channelType, fixedRate, settlementType});
        const alreadyExistsFlag = proxy.rate.filter(obj => obj.channelType === channelType);
        if (alreadyExistsFlag)
            return res.json({success: false, msg: `${channelType} in Proxy Already Exists`});
        else {
            await proxy.save();
            return res.json({success: true});
        }
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Proxy Rate Info');
    }
} 

exports.modifyAccountInProxy = async(req, res) => {
    const { id, account } = req.body;
    try {
        await Proxy.findOneAndUpdate({_id: id}, {account});
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Proxy Info');
    }
}

exports.changeMembersInProxy = async(req, res) => {
    const { id, members } = req.body;
    try {
        await Proxy.findOneAndUpdate({_id: id}, {members});
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Proxy Info');
    }
}

exports.changeProxyState = async(req, res)=> {
    const { id, state} = req.body;
    try {
        await Proxy.findOneAndUpdate({_id: id}, {state});
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Proxy Info');
    }
}

exports.deleteProxy = async(req, res) => {
    let { id } = req.params;
    try {
        await Proxy.deleteOne({ _id : id });
        await logOperation(req);
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Proxy ID');
    }
}

exports.addChannelInProxy = async(req, res) => {
    let { proxyId, channelType, channelName, rate, state } = req.body;
    try {
        let channel = await Channel.findOne({proxyId, channelType});
        if (!channel){
            await Channel.create({
                proxyId, channelType, channelName, rate, state
            });
            return res.json({success: true});
        }
        return sendError(req, res, 400, 'Already Exists');
            
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Channel');
    }
}

const generateKey = () => {
    let key = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      key += characters.charAt(randomIndex);
    }
    console.log("key:", key);
    return key;
}

exports.addMerchantInProxy = async(req, res) => {
    let { account, name, password, paymentRate, proxyId } = req.body;
    let secretKey = generateKey();
    try {
        let merchant = await Merchant.findOne({account, name});
        if (merchant) return sendError(req, res, 400, 'Merchant Already Exists');
        merchant = await Merchant.create({
            account, name, paymentRate, password, secretKey
        });
        let proxy = await Proxy.findOne({_id: proxyId});
        proxy.members.push(merchant._id);
        await proxy.save();
        return res.json({success: true});
    } catch (err) {
        console.log(err);
        return sendError(req, res, 400, 'Invalid Merchant Info');
    }
}