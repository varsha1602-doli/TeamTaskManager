const prisma = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true },
    orderBy: { name: 'asc' },
  });
  res.status(200).json({ success: true, data: users });
});
