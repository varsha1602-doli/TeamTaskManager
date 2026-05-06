const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const userController = require('../controllers/userController');

const router = express.Router();

router.use(authenticate);
router.get('/', authorize('ADMIN'), userController.getAllUsers);

module.exports = router;
