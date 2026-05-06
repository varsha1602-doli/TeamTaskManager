# Team Task Manager

A modern full-stack team collaboration platform for managing projects, tasks, and team productivity with role-based access control.

## 🚀 Live Demo

- **Frontend:** _Coming soon (Vercel)_
- **Backend:** _Coming soon (Railway)_

### Demo Credentials

| Role   | Email                    | Password    |
|--------|--------------------------|-------------|
| Admin  | varshadoli909@gmail.com  | V@rsha#16   |
| Member | rahul@demo.com           | Member@123  |

## ✨ Features

- **Authentication** — JWT-based with httpOnly cookies, signup/login/logout
- **Role-Based Access** — Admin and Member roles with granular permissions
- **Project Management** — Create, edit, delete projects with deadlines and team assignments
- **Task Management** — Full CRUD with status (Todo/In Progress/Review/Completed), priority levels, due dates
- **Kanban Board** — Visual task board organized by status columns
- **Dashboard Analytics** — Admin and member dashboards with charts (Recharts)
- **Team Collaboration** — Invite members, assign tasks, track activity
- **Dark/Light Mode** — Theme toggle with persistence
- **Responsive Design** — Mobile-friendly layout

## 🛠 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 19, Vite, React Router       |
| Styling    | Vanilla CSS (custom design system)  |
| Charts     | Recharts                            |
| Animations | Framer Motion                       |
| Icons      | Lucide React                        |
| HTTP       | Axios, React Query                  |
| Backend    | Node.js, Express 5                  |
| ORM        | Prisma 7                            |
| Database   | PostgreSQL (Neon)                   |
| Auth       | JWT, bcrypt                         |
| Deployment | Railway (API), Vercel (Client)      |

## 📁 Project Structure

```
├── client/                  # React frontend
│   ├── src/
│   │   ├── api/             # Axios instance
│   │   ├── components/      # Reusable UI components
│   │   │   └── layout/      # Sidebar, TopBar, AppLayout
│   │   ├── context/         # Auth & Theme providers
│   │   ├── pages/           # Route pages
│   │   ├── routes/          # ProtectedRoute
│   │   └── index.css        # Design system
│   └── vite.config.js
│
├── server/                  # Express backend
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.js          # Demo data seeder
│   ├── src/
│   │   ├── config/          # Env config, DB client
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/       # Auth, RBAC, validation, errors
│   │   ├── routes/          # Express routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # AppError, asyncHandler, logger
│   └── server.js
```

## 🔧 Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (or [Neon](https://neon.tech) free tier)

### Backend Setup
```bash
cd server
npm install
cp .env.example .env          # Fill in your DATABASE_URL and JWT_SECRET
npx prisma migrate dev        # Run database migrations
npx prisma generate           # Generate Prisma client
npm run seed                  # Seed demo data
npm run dev                   # Start server on port 5000
```

### Frontend Setup
```bash
cd client
npm install
npm run dev                   # Start client on port 5173
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint            | Access  | Description        |
|--------|---------------------|---------|--------------------|
| POST   | /api/auth/register  | Public  | Create account     |
| POST   | /api/auth/login     | Public  | Login              |
| GET    | /api/auth/me        | Auth    | Get current user   |
| POST   | /api/auth/logout    | Auth    | Logout             |

### Projects
| Method | Endpoint            | Access  | Description        |
|--------|---------------------|---------|--------------------|
| GET    | /api/projects       | Auth    | List projects      |
| POST   | /api/projects       | Admin   | Create project     |
| GET    | /api/projects/:id   | Auth    | Get project detail |
| PUT    | /api/projects/:id   | Admin   | Update project     |
| DELETE | /api/projects/:id   | Admin   | Delete project     |

### Tasks
| Method | Endpoint            | Access  | Description        |
|--------|---------------------|---------|--------------------|
| GET    | /api/tasks          | Auth    | List tasks         |
| POST   | /api/tasks          | Admin   | Create task        |
| PUT    | /api/tasks/:id      | Auth    | Update task        |
| DELETE | /api/tasks/:id      | Admin   | Delete task        |

### Team
| Method | Endpoint                          | Access | Description    |
|--------|-----------------------------------|--------|----------------|
| GET    | /api/projects/:id/members         | Auth   | List members   |
| POST   | /api/projects/:id/members         | Admin  | Add member     |
| DELETE | /api/projects/:id/members/:userId | Admin  | Remove member  |

### Dashboard
| Method | Endpoint              | Access | Description       |
|--------|-----------------------|--------|-------------------|
| GET    | /api/dashboard/admin  | Admin  | Admin analytics   |
| GET    | /api/dashboard/member | Member | Member dashboard  |

### Users
| Method | Endpoint    | Access | Description  |
|--------|-------------|--------|--------------|
| GET    | /api/users  | Admin  | List users   |

## 🔒 Security

- JWT stored in httpOnly cookies (not localStorage)
- Password hashing with bcrypt (12 rounds)
- Input validation with express-validator
- Rate limiting (500 req/15 min)
- Helmet security headers
- CORS configured for frontend origin
- Role-based authorization middleware

## 📄 License

MIT
