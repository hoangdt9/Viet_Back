const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');


router
    .route('/login')
    .post(adminAuthController.login);

router
    .route('/register')
    .post(adminAuthController.register);

router
    .route('/changePassword')
    .post(adminAuthController.changePassword);

module.exports = router;