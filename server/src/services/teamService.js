const prisma = require('../config/db');
const AppError = require('../utils/AppError');

const addMember = async (projectId, userId) => {
  // Verify project exists
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    throw new AppError('Project not found.', 404);
  }

  // Verify user exists
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  // Check if already a member
  const existing = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });
  if (existing) {
    throw new AppError('User is already a member of this project.', 409);
  }

  return prisma.projectMember.create({
    data: { userId, projectId },
    include: {
      user: { select: { id: true, name: true, email: true, role: true, avatar: true } },
    },
  });
};

const removeMember = async (projectId, userId) => {
  const membership = await prisma.projectMember.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });

  if (!membership) {
    throw new AppError('User is not a member of this project.', 404);
  }

  // Unassign any tasks assigned to this member in this project
  await prisma.task.updateMany({
    where: { projectId, assigneeId: userId },
    data: { assigneeId: null },
  });

  await prisma.projectMember.delete({
    where: { userId_projectId: { userId, projectId } },
  });

  return { message: 'Member removed successfully.' };
};

const getProjectMembers = async (projectId) => {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    throw new AppError('Project not found.', 404);
  }

  return prisma.projectMember.findMany({
    where: { projectId },
    include: {
      user: { select: { id: true, name: true, email: true, role: true, avatar: true } },
    },
  });
};

module.exports = { addMember, removeMember, getProjectMembers };
