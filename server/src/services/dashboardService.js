const prisma = require('../config/db');

const getAdminDashboard = async () => {
  const [
    totalProjects,
    totalTasks,
    tasksByStatus,
    tasksByPriority,
    overdueTasks,
    totalMembers,
    recentTasks,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.task.count(),
    prisma.task.groupBy({ by: ['status'], _count: { status: true } }),
    prisma.task.groupBy({ by: ['priority'], _count: { priority: true } }),
    prisma.task.count({
      where: {
        dueDate: { lt: new Date() },
        status: { not: 'COMPLETED' },
      },
    }),
    prisma.user.count({ where: { role: 'MEMBER' } }),
    prisma.task.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
        project: { select: { id: true, name: true } },
      },
    }),
  ]);

  // Format status counts into an object
  const statusCounts = { TODO: 0, IN_PROGRESS: 0, REVIEW: 0, COMPLETED: 0 };
  tasksByStatus.forEach((s) => { statusCounts[s.status] = s._count.status; });

  const priorityCounts = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
  tasksByPriority.forEach((p) => { priorityCounts[p.priority] = p._count.priority; });

  return {
    totalProjects,
    totalTasks,
    statusCounts,
    priorityCounts,
    overdueTasks,
    totalMembers,
    completedTasks: statusCounts.COMPLETED,
    pendingTasks: totalTasks - statusCounts.COMPLETED,
    recentTasks,
  };
};

const getMemberDashboard = async (userId) => {
  const [
    assignedTasks,
    tasksByStatus,
    overdueTasks,
    upcomingTasks,
  ] = await Promise.all([
    prisma.task.count({ where: { assigneeId: userId } }),
    prisma.task.groupBy({
      by: ['status'],
      where: { assigneeId: userId },
      _count: { status: true },
    }),
    prisma.task.count({
      where: {
        assigneeId: userId,
        dueDate: { lt: new Date() },
        status: { not: 'COMPLETED' },
      },
    }),
    prisma.task.findMany({
      where: {
        assigneeId: userId,
        status: { not: 'COMPLETED' },
        dueDate: { gte: new Date() },
      },
      take: 5,
      orderBy: { dueDate: 'asc' },
      include: {
        project: { select: { id: true, name: true } },
      },
    }),
  ]);

  const statusCounts = { TODO: 0, IN_PROGRESS: 0, REVIEW: 0, COMPLETED: 0 };
  tasksByStatus.forEach((s) => { statusCounts[s.status] = s._count.status; });

  return {
    assignedTasks,
    statusCounts,
    completedTasks: statusCounts.COMPLETED,
    overdueTasks,
    upcomingTasks,
  };
};

module.exports = { getAdminDashboard, getMemberDashboard };
