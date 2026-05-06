const teamService = require('../services/teamService');
const asyncHandler = require('../utils/asyncHandler');

exports.addMember = asyncHandler(async (req, res) => {
  const member = await teamService.addMember(req.params.id, req.body.userId);
  res.status(201).json({ success: true, data: member });
});

exports.removeMember = asyncHandler(async (req, res) => {
  const result = await teamService.removeMember(req.params.id, req.params.userId);
  res.status(200).json({ success: true, ...result });
});

exports.getMembers = asyncHandler(async (req, res) => {
  const members = await teamService.getProjectMembers(req.params.id);
  res.status(200).json({ success: true, data: members });
});
