const express = require('express');
const router = express.Router();
const adminDebitCardController = require('../controllers/adminDebitCardController');

router
    .route('/addCard')
    .put(adminDebitCardController.addDebitCard);

router
    .route('/modifyCard')
    .post(adminDebitCardController.modifyDebitCard);

router
    .route('/getAllCards')
    .get(adminDebitCardController.getAllDebitCards);

router
    .route('/deleteCard/:id')
    .delete(adminDebitCardController.deleteDebitCard);

router
    .route('/changePaymentRobot')
    .post(adminDebitCardController.changePaymentRobot)

router
    .route('/search')
    .post(adminDebitCardController.search);

router
    .route('/setWithDrawalSetting')
    .post(adminDebitCardController.setWithDrawalSetting);

router
    .route('/changeBalance')
    .post(adminDebitCardController.changeBalance);

router
    .route('/changeSequence')
    .post(adminDebitCardController.changeSequence);

router
    .route('/getAllDebitCardTransferLog')
    .get(adminDebitCardController.getAllDebitCardTransferLog);

router
    .route('/transferBetDebitCards')
    .post(adminDebitCardController.transferBetDebitCards);

router
    .route('/modifyTransferLog')
    .post(adminDebitCardController.modifyTransferLog);

router
    .route('/deleteTransferLog/:id')
    .delete(adminDebitCardController.deleteTransferLog);

router
    .route('/changeCheckedCard')
    .post(adminDebitCardController.changeCheckedCard);
module.exports = router;