const taskService = require('../services/taskService');
const asyncHandler = require('../utils/asyncHandler');

exports.create = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.body, req.user.id);
  res.status(201).json({ success: true, data: task });
});

exports.getAll = asyncHandler(async (req, res) => {
  const { status, priority, projectId, assigneeId } = req.query;
  const tasks = await taskService.getAllTasks(req.user, { status, priority, projectId, assigneeId });
  res.status(200).json({ success: true, data: tasks });
});

exports.getById = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id, req.user);
  res.status(200).json({ success: true, data: task });
});

exports.update = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body, req.user);
  res.status(200).json({ success: true, data: task });
});

exports.remove = asyncHandler(async (req, res) => {
  const result = await taskService.deleteTask(req.params.id);
  res.status(200).json({ success: true, ...result });
});
