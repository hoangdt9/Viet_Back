const express = require('express');
const router = express.Router();
const merchantAuthController = require('../controllers/merchantAuthController');


router
    .route('/login')
    .post(merchantAuthController.login);

module.exports = router;