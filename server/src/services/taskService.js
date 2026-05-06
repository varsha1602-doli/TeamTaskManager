const prisma = require('../config/db');
const AppError = require('../utils/AppError');

const createTask = async (data, creatorId) => {
  // Verify project exists
  const project = await prisma.project.findUnique({ where: { id: data.projectId } });
  if (!project) {
    throw new AppError('Project not found.', 404);
  }

  // If assignee specified, verify they are a project member
  if (data.assigneeId) {
    const membership = await prisma.projectMember.findUnique({
      where: { userId_projectId: { userId: data.assigneeId, projectId: data.projectId } },
    });
    if (!membership) {
      throw new AppError('Assignee is not a member of this project.', 400);
    }
  }

  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      priority: data.priority || 'MEDIUM',
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      projectId: data.projectId,
      assigneeId: data.assigneeId || null,
      creatorId,
    },
    include: {
      assignee: { select: { id: true, name: true, email: true, avatar: true } },
      creator: { select: { id: true, name: true } },
      project: { select: { id: true, name: true } },
    },
  });
};

const getAllTasks = async (user, filters = {}) => {
  const where = {};

  // Members only see their assigned tasks
  if (user.role === 'MEMBER') {
    where.assigneeId = user.id;
  }

  // Apply filters
  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.projectId) where.projectId = filters.projectId;
  if (filters.assigneeId && user.role === 'ADMIN') where.assigneeId = filters.assigneeId;

  return prisma.task.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      assignee: { select: { id: true, name: true, email: true, avatar: true } },
      creator: { select: { id: true, name: true } },
      project: { select: { id: true, name: true } },
    },
  });
};

const getTaskById = async (id, user) => {
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      assignee: { select: { id: true, name: true, email: true, avatar: true } },
      creator: { select: { id: true, name: true } },
      project: { select: { id: true, name: true } },
    },
  });

  if (!task) {
    throw new AppError('Task not found.', 404);
  }

  // Members can only view their own tasks
  if (user.role === 'MEMBER' && task.assigneeId !== user.id) {
    throw new AppError('You do not have access to this task.', 403);
  }

  return task;
};

const updateTask = async (id, data, user) => {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    throw new AppError('Task not found.', 404);
  }

  // Members can only update status of their own tasks
  if (user.role === 'MEMBER') {
    if (task.assigneeId !== user.id) {
      throw new AppError('You can only update tasks assigned to you.', 403);
    }
    // Members can only change status
    return prisma.task.update({
      where: { id },
      data: { status: data.status },
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true } },
        creator: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
    });
  }

  // Admin can update everything
  return prisma.task.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status && { status: data.status }),
      ...(data.priority && { priority: data.priority }),
      ...(data.dueDate !== undefined && { dueDate: data.dueDate ? new Date(data.dueDate) : null }),
      ...(data.assigneeId !== undefined && { assigneeId: data.assigneeId || null }),
    },
    include: {
      assignee: { select: { id: true, name: true, email: true, avatar: true } },
      creator: { select: { id: true, name: true } },
      project: { select: { id: true, name: true } },
    },
  });
};

const deleteTask = async (id) => {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    throw new AppError('Task not found.', 404);
  }

  await prisma.task.delete({ where: { id } });
  return { message: 'Task deleted successfully.' };
};

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask };
