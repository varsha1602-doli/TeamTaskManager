const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const teamController = require('../controllers/teamController');

const router = express.Router();

router.use(authenticate);

router.get('/:id/members', teamController.getMembers);

router.post(
  '/:id/members',
  authorize('ADMIN'),
  [body('userId').notEmpty().withMessage('User ID is required')],
  validate,
  teamController.addMember
);

router.delete('/:id/members/:userId', authorize('ADMIN'), teamController.removeMember);

module.exports = router;
