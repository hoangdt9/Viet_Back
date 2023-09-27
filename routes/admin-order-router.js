const express = require('express');
const router = express.Router();
const adminOrderController = require('../controllers/adminOrderController');

router
    .route('/getAllOrders')
    .get(adminOrderController.getAllOrders);

router
    .route('/getOrderInfo')
    .get(adminOrderController.getOrderInfo);

router
    .route('/getOrdersByPage/:page/:count')
    .get(adminOrderController.getOrdersByPage)

router
    .route('/addOrder')
    .post(adminOrderController.addOrder);

router
    .route('/getOrdersByStatus/:status')
    .get(adminOrderController.getOrdersByStatus);

router
    .route('/requestRefund')
    .post(adminOrderController.requestRefund);

router
    .route('/getAllRefundingOrders')
    .get(adminOrderController.getAllRefundingOrders);

router
    .route('/modifyPaymentAmount')
    .post(adminOrderController.modifyPaymentAmount);



module.exports = router;