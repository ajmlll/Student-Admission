# School Admission Management System

A full-stack monorepo application for coordinating student admissions and entrance examination bookings.

---

## Technical Stack
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, React Context
- **Backend**: NestJS, TypeScript, Mongoose (MongoDB), Passport (JWT)
- **Database**: MongoDB

---

## Directory Structure
```
Student-Admission/
├── README.md                 # Root instructions (this file)
├── .gitignore                # Root git exclusions
├── backend/                  # NestJS API backend server
└── frontend/                 # Next.js App Router frontend client
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (running locally on port `27017` or accessible via URI)

---

### 1. Backend Setup & Run

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   - Duplicate `.env.example` and rename to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Customize values inside `.env` if necessary (e.g. `MONGO_URI`, `JWT_SECRET`).

4. Seed the database with the initial Admission Team user:
   ```bash
   npm run db:seed
   ```
   *This seeds a default admin account:*
   - **Email:** `admin@school.com`
   - **Password:** `AdminPass123!`
   - **Role:** `admission_team`

5. Start the backend development server:
   ```bash
   npm run start:dev
   ```
   - The API will be available at: `http://localhost:3001/api`
   - Swagger OpenAPI Docs: `http://localhost:3001/api/docs`

---

### 2. Frontend Setup & Run

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   - Duplicate `.env.example` and rename to `.env`:
     ```bash
     cp .env.example .env
     ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   - The client portal will be available at: `http://localhost:3000`

---

## Authentication & Verification Flows

1. **User Sign-up (Parents)**: Parents can register a new account on the `/register` page. This creates a user with the `parent` role. Self-registration for the `admission_team` role is disabled.
2. **Staff Login (Admission Team)**: Use the seeded credentials (`admin@school.com` / `AdminPass123!`) to sign in as the admission team role.
3. **Session Security**: The JWT token returned by the backend is stored in an HTTP-only cookie set by local Next.js Route Handlers.
4. **Access Control**: Role-based access control is implemented inside the Edge `middleware.ts` to redirect unauthenticated or unauthorized requests.
