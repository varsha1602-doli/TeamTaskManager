const prisma = require('../config/db');
const AppError = require('../utils/AppError');

const createProject = async (data) => {
  return prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      deadline: data.deadline ? new Date(data.deadline) : null,
    },
    include: { members: { include: { user: { select: { id: true, name: true, email: true, role: true, avatar: true } } } }, _count: { select: { tasks: true } } },
  });
};

const getAllProjects = async (user) => {
  if (user.role === 'ADMIN') {
    return prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
        _count: { select: { tasks: true } },
      },
    });
  }

  // Members only see projects they belong to
  return prisma.project.findMany({
    where: { members: { some: { userId: user.id } } },
    orderBy: { createdAt: 'desc' },
    include: {
      members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
      _count: { select: { tasks: true } },
    },
  });
};

const getProjectById = async (id, user) => {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      members: { include: { user: { select: { id: true, name: true, email: true, role: true, avatar: true } } } },
      tasks: {
        orderBy: { createdAt: 'desc' },
        include: {
          assignee: { select: { id: true, name: true, email: true, avatar: true } },
          creator: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!project) {
    throw new AppError('Project not found.', 404);
  }

  // Members can only view projects they belong to
  if (user.role === 'MEMBER') {
    const isMember = project.members.some((m) => m.userId === user.id);
    if (!isMember) {
      throw new AppError('You do not have access to this project.', 403);
    }
  }

  return project;
};

const updateProject = async (id, data) => {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    throw new AppError('Project not found.', 404);
  }

  return prisma.project.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status && { status: data.status }),
      ...(data.deadline !== undefined && { deadline: data.deadline ? new Date(data.deadline) : null }),
    },
    include: {
      members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
      _count: { select: { tasks: true } },
    },
  });
};

const deleteProject = async (id) => {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    throw new AppError('Project not found.', 404);
  }

  await prisma.project.delete({ where: { id } });
  return { message: 'Project deleted successfully.' };
};

module.exports = { createProject, getAllProjects, getProjectById, updateProject, deleteProject };
