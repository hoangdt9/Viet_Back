const express = require('express');
const router = express.Router();
const adminMerchantController = require('../controllers/adminMerchantController');

router
    .route('/getAllMerchants')
    .get(adminMerchantController.getAllMerchants);

router
    .route('/modifyMerchant')
    .post(adminMerchantController.modifyMerchant);

router
    .route('/registMerchant')
    .post(adminMerchantController.registMerchant);

router
    .route('/deleteMerchant/:id')
    .delete(adminMerchantController.deleteMerchant);;

router
    .route('/changeAccountStatus')
    .post( adminMerchantController.changeAccountStatus );

router
    .route('/setInnerFilling')
    .post(adminMerchantController.setInnerFilling);

router
    .route('/getAllFillings')
    .get(adminMerchantController.getAllFillings);

module.exports = router;