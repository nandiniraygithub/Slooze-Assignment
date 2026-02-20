# Commodities Management System (Slooze)

A robust full-stack application for managing commodity inventories, featuring role-based access control (RBAC), real-time dashboards, and secure authentication.

## 🚀 Tech Stack

**Backend**
- **Framework:** [NestJS](https://nestjs.com/)
- **Language:** TypeScript
- **API:** GraphQL (Apollo Server)
- **Database:** MongoDB (via [Prisma ORM](https://www.prisma.io/))
- **Auth:** JWT & BCrypt

**Frontend**
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/)
- **State/Data:** Apollo Client
- **Visualization:** Recharts

---

## 🛠️ Prerequisites

Before you begin, ensure you have:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** running locally or a cloud instance (e.g., MongoDB Atlas)

---

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd slooz-assignment
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
# backend/.env
DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/commodities"
JWT_SECRET="super-secret-key"
PORT=3000
```
*(Replace `DATABASE_URL` with your local or Atlas connection string)*

Generate Prisma Client:
```bash
npx prisma generate
```

Start the Backend Server:
```bash
# Development mode
npm run start:dev
```
The GraphQL API will be available at `http://localhost:3000/graphql`.

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory:
```bash
cd frontend
npm install
```

Create a `.env` file (optional, defaults to localhost):
```env
# frontend/.env.local
NEXT_PUBLIC_API_URL="http://localhost:3000/graphql"
```

Start the Frontend Server:
```bash
npm run dev
```
The app will be running at `http://localhost:3001`.

---

## 🐳 Docker Setup

For a one-click local setup, you can use Docker Compose.

1. **Install Docker:**
   - [Docker Desktop for Mac/Windows](https://www.docker.com/products/docker-desktop)
   - [Docker Engine for Linux](https://docs.docker.com/engine/install/)

2. **Stop Local Servers:**
   If you have `npm run dev` or `npm run start` running in other terminals, **stop them** (Ctrl+C) to free up ports 3000 and 3001.

3. **Run the Application:**
   Run the following command in the root directory:
   ```bash
   docker-compose up --build
   ```

   This will:
   - Start a MongoDB container.
   - Build and start the Backend (NestJS).
   - Build and start the Frontend (Next.js).

3. **Access:**
   - Frontend: `http://localhost:3001`
   - Backend API: `http://localhost:3000/graphql`
   - Database: `localhost:27017`

## 🚢 How to Deploy

### Authenticate & Database (MongoDB Atlas)
1. Create a free account on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a Cluster and get your connection string.
3. Replace the `DATABASE_URL` in your backend `.env` with this production string.

### Push to GitHub
1. Initialize Git in the root folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Create a new repository on GitHub.
3. Link and push:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```

### Backend Deployment (Render.com)
1. Sign up on [Render](https://render.com/).
2. Create a new **Web Service**.
3. Connect your GitHub repository.
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Environment Variables:** Add `DATABASE_URL` and `JWT_SECRET`.

### Frontend Deployment (Vercel)
1. Sign up on [Vercel](https://vercel.com/).
2. Import your GitHub repository.
3. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Next.js
   - **Environment Variables:** Add `NEXT_PUBLIC_API_URL` pointing to your deployed Backend URL (e.g., `https://your-backend.onrender.com/graphql`).
4. Click **Deploy**.

---

## 🧪 Default Users

The system comes with `prisma/seed.ts`. You can run `npx prisma db seed` in the backend folder to create default accounts:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Manager** | `manager@slooze.com` | `password123` | Dashboard, Charts, Manage Users |
| **Store Keeper** | `store@slooze.com` | `password123` | Product Inventory, Add/Edit Products |

---

## 📂 Project Structure

```
slooz-assignment/
├── backend/            # NestJS API
│   ├── src/
│   │   ├── auth/       # JWT Auth logic
│   │   ├── products/   # Product CRUD
│   │   ├── users/      # User management
│   │   └── app.module.ts
│   └── prisma/         # DB Schema & Seed
├── frontend/           # Next.js App
│   ├── src/
│   │   ├── app/        # Pages (Dashboard, Login, Products)
│   │   ├── components/ # Reusable UI (Sidebar, Charts)
│   │   └── lib/        # Utils
│   └── public/         # Icons & Assets
└── README.md
```
