const express = require('express');
const router = express.Router();
const adminIpWhiteAddressController = require('../controllers/adminIpWhiteAddressController');


router
    .route('/getIpWhiteAddressList')
    .get(adminIpWhiteAddressController.getIpWhiteAddressList);

router
    .route('/addIpWhiteAddress')
    .put(adminIpWhiteAddressController.addIpWhiteAddress);

router
    .route('/modifyIpWhiteAddress')
    .post(adminIpWhiteAddressController.modifyIpWhiteAddress);

router
    .route('/deleteIpWhiteAddress/:id')
    .delete(adminIpWhiteAddressController.deleteIpWhiteAddress);;



    
router
    .route('/getOperationLogsInfo')
    .get(adminIpWhiteAddressController.getOperationLogsInfo);

router
    .route('/getOperationLogsByPage/:count/:page')
    .get(adminIpWhiteAddressController.getOperationLogsByPage)

router
    .route('/deleteOperationLog/:id')
    .delete(adminIpWhiteAddressController.deleteOperationLog);

module.exports = router;