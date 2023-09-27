const express = require('express');
const router = express.Router();

router.use('/merchant/auth', require('./merchant-auth-router'));

router.use('/admin/auth', require('./admin-auth-router'));
router.use('/admin/order', require('./admin-order-router'));
router.use('/admin/user', require('./admin-user-router'));
router.use('/admin/debitCard', require('./admin-debitCard-router'));
router.use('/admin/collection', require('./admin-collection-router'));
router.use('/admin/merchant', require('./admin-merchant-router'));
router.use('/admin/proxy', require('./admin-proxy-router'));
router.use('/admin/ipWhite', require('./admin-ipWhite-router'));

module.exports = router;