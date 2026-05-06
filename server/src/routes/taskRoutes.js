const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const taskController = require('../controllers/taskController');

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  authorize('ADMIN'),
  [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('projectId').notEmpty().withMessage('Project ID is required'),
  ],
  validate,
  taskController.create
);

router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.put('/:id', taskController.update);
router.delete('/:id', authorize('ADMIN'), taskController.remove);

module.exports = router;
