const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

router.use(authenticate);

router.get('/admin', authorize('ADMIN'), dashboardController.adminDashboard);
router.get('/member', authorize('MEMBER'), dashboardController.memberDashboard);

module.exports = router;
