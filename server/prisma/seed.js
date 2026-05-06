require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log('🌱 Seeding database...\n');

  // Clean existing data
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin
  const adminPassword = await bcrypt.hash('V@rsha#16', 12);
  const admin = await prisma.user.create({
    data: {
      name: 'Varsha',
      email: 'varshadoli909@gmail.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // Create Members
  const memberPassword = await bcrypt.hash('Member@123', 12);
  const members = await Promise.all([
    prisma.user.create({
      data: { name: 'Rahul Sharma', email: 'rahul@demo.com', password: memberPassword, role: 'MEMBER' },
    }),
    prisma.user.create({
      data: { name: 'Priya Patel', email: 'priya@demo.com', password: memberPassword, role: 'MEMBER' },
    }),
    prisma.user.create({
      data: { name: 'Arjun Reddy', email: 'arjun@demo.com', password: memberPassword, role: 'MEMBER' },
    }),
  ]);
  console.log(`✅ ${members.length} members created`);

  // Create Projects
  const project1 = await prisma.project.create({
    data: {
      name: 'E-Commerce Platform Redesign',
      description: 'Complete redesign of the customer-facing e-commerce platform with modern UI/UX, improved checkout flow, and mobile-first approach.',
      status: 'ACTIVE',
      deadline: new Date('2026-06-15'),
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Internal Analytics Dashboard',
      description: 'Build an internal dashboard for tracking sales metrics, customer engagement, and team productivity KPIs.',
      status: 'ACTIVE',
      deadline: new Date('2026-07-01'),
    },
  });
  console.log('✅ 2 projects created');

  // Add members to projects
  await prisma.projectMember.createMany({
    data: [
      { userId: members[0].id, projectId: project1.id },
      { userId: members[1].id, projectId: project1.id },
      { userId: members[2].id, projectId: project1.id },
      { userId: members[0].id, projectId: project2.id },
      { userId: members[2].id, projectId: project2.id },
    ],
  });
  console.log('✅ Members assigned to projects');

  // Create Tasks for Project 1
  const tasks1 = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Design new product listing page',
        description: 'Create wireframes and high-fidelity mockups for the product listing page with filters and sorting.',
        status: 'COMPLETED',
        priority: 'HIGH',
        dueDate: new Date('2026-05-20'),
        projectId: project1.id,
        assigneeId: members[0].id,
        creatorId: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Implement shopping cart API',
        description: 'Build REST API endpoints for cart operations: add, remove, update quantity, and checkout.',
        status: 'IN_PROGRESS',
        priority: 'CRITICAL',
        dueDate: new Date('2026-05-25'),
        projectId: project1.id,
        assigneeId: members[1].id,
        creatorId: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Mobile responsive navigation',
        description: 'Implement hamburger menu and responsive navigation for mobile and tablet viewports.',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: new Date('2026-06-01'),
        projectId: project1.id,
        assigneeId: members[2].id,
        creatorId: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Payment gateway integration',
        description: 'Integrate Stripe payment gateway with support for cards and UPI.',
        status: 'TODO',
        priority: 'CRITICAL',
        dueDate: new Date('2026-06-10'),
        projectId: project1.id,
        assigneeId: members[0].id,
        creatorId: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Write unit tests for auth module',
        description: 'Add comprehensive unit tests for login, register, and password reset flows.',
        status: 'REVIEW',
        priority: 'LOW',
        dueDate: new Date('2026-05-18'),
        projectId: project1.id,
        assigneeId: members[1].id,
        creatorId: admin.id,
      },
    }),
  ]);

  // Create Tasks for Project 2
  const tasks2 = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Setup data pipeline for metrics',
        description: 'Configure data ingestion pipeline to aggregate sales and engagement metrics from multiple sources.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: new Date('2026-05-30'),
        projectId: project2.id,
        assigneeId: members[0].id,
        creatorId: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Design dashboard chart components',
        description: 'Create reusable chart components using Recharts for line, bar, and pie charts.',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: new Date('2026-06-05'),
        projectId: project2.id,
        assigneeId: members[2].id,
        creatorId: admin.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Implement date range filters',
        description: 'Add date range picker with presets (7d, 30d, 90d, custom) for filtering dashboard data.',
        status: 'TODO',
        priority: 'LOW',
        dueDate: new Date('2026-06-12'),
        projectId: project2.id,
        assigneeId: members[0].id,
        creatorId: admin.id,
      },
    }),
  ]);

  console.log(`✅ ${tasks1.length + tasks2.length} tasks created`);
  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📋 Demo Credentials:');
  console.log('   Admin: varshadoli909@gmail.com / V@rsha#16');
  console.log('   Member: rahul@demo.com / Member@123');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
