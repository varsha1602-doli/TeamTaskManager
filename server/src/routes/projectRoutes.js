const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const projectController = require('../controllers/projectController');

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  authorize('ADMIN'),
  [
    body('name').trim().notEmpty().withMessage('Project name is required'),
  ],
  validate,
  projectController.create
);

router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);

router.put(
  '/:id',
  authorize('ADMIN'),
  projectController.update
);

router.delete('/:id', authorize('ADMIN'), projectController.remove);

module.exports = router;
