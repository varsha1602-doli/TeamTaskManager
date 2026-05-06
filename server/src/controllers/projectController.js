const projectService = require('../services/projectService');
const asyncHandler = require('../utils/asyncHandler');

exports.create = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(req.body);
  res.status(201).json({ success: true, data: project });
});

exports.getAll = asyncHandler(async (req, res) => {
  const projects = await projectService.getAllProjects(req.user);
  res.status(200).json({ success: true, data: projects });
});

exports.getById = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(req.params.id, req.user);
  res.status(200).json({ success: true, data: project });
});

exports.update = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(req.params.id, req.body);
  res.status(200).json({ success: true, data: project });
});

exports.remove = asyncHandler(async (req, res) => {
  const result = await projectService.deleteProject(req.params.id);
  res.status(200).json({ success: true, ...result });
});
