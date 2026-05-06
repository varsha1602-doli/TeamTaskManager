const dashboardService = require('../services/dashboardService');
const asyncHandler = require('../utils/asyncHandler');

exports.adminDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getAdminDashboard();
  res.status(200).json({ success: true, data });
});

exports.memberDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getMemberDashboard(req.user.id);
  res.status(200).json({ success: true, data });
});
