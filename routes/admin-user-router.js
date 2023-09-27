const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');

router
    .route('/getAdminLogs')
    .get(adminUserController.getAdminLogs);

module.exports = router;