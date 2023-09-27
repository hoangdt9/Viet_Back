const express = require('express');
const router = express.Router();
const adminCollectionController = require('../controllers/adminCollectionController');

router
    .route('/getAllGates')
    .get(adminCollectionController.getAllGates)

router
    .route('/addGate')
    .put(adminCollectionController.addGate);

router
    .route('/modifyGate')
    .post(adminCollectionController.modifyGate);

router
    .route('/deleteGate/:id')
    .delete(adminCollectionController.deleteGate);


router
    .route('/getAllLabels')
    .get(adminCollectionController.getAllLabels)

router
    .route('/addLabel')
    .put(adminCollectionController.addLabel);

router
    .route('/deleteLabel/:id')
    .delete(adminCollectionController.deleteLabel);


router
    .route('/getAllCollectionCardsByType/:cardType')
    .get(adminCollectionController.getAllCollectionCardsByType)

router
    .route('/addCollectionCard')
    .put(adminCollectionController.addCollectionCard);

router
    .route('/modifyCollectionCard')
    .post(adminCollectionController.modifyCollectionCard);

router
    .route('/changeState')
    .post(adminCollectionController.changeState);

router
    .route('/searchByClassification')
    .post(adminCollectionController.searchByClassification);

router
    .route('/changeCrawlerStatus')
    .post(adminCollectionController.changeCrawlerStatus);

router
    .route('/deleteCollectionCard/:id')
    .delete(adminCollectionController.deleteCollectionCard);

router
    .route('/registRollOver')
    .post(adminCollectionController.registRollOver);

router
    .route('/getRollOverByBanking')
    .get(adminCollectionController.getRollOverByBanking);

router
    .route('/getRollOverByCollectionId/:collectionId')
    .get(adminCollectionController.getRollOverByCollectionId)

router
    .route('/saveRestrictMerchants')
    .post(adminCollectionController.saveRestrictMerchants);

router
    .route('/setAlarm')
    .post(adminCollectionController.setAlarm)

router
    .route('/getAllTransactions')
    .get(adminCollectionController.getAllTransactions)

router
    .route('/getAllScreenshots')
    .get(adminCollectionController.getAllScreenshots);

router
    .route('/setTransIdInScreenshot')
    .post(adminCollectionController.setTransIdInScreenshot);

// router
//     .route('/removeTransIdInSreenshot')
//     .post(adminCollectionController.removeTransIdInSreenshot);

module.exports = router;