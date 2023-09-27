const express = require('express');
const router = express.Router();
const adminProxyController = require('../controllers/adminProxyController');

router
    .route('/getAllProxies')
    .get(adminProxyController.getAllProxies);

router
    .route('/getProxyInfoById/:id')
    .get(adminProxyController.getProxyInfoById)

router
    .route('/addProxy')
    .put(adminProxyController.addProxy);

router
    .route('/addRateInProxy')
    .put(adminProxyController.addRateInProxy);

router
    .route('/modifyAccountInProxy')
    .post(adminProxyController.modifyAccountInProxy)

router
    .route('/changeMembersInProxy')
    .post(adminProxyController.changeMembersInProxy);

router
    .route('/changeProxyState')
    .post(adminProxyController.changeProxyState)

router
    .route('/deleteProxy/:id')
    .delete(adminProxyController.deleteProxy);

router
    .route('/addChannelInProxy')
    .put(adminProxyController.addChannelInProxy);

router
    .route('/addMerchantInProxy')
    .put(adminProxyController.addMerchantInProxy)

module.exports = router;