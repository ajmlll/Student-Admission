# 🚀 Deployment Guide: Render (Backend) & Vercel (Frontend)

This guide walks you through deploying the School Admission Management System. Because the app runs on a MongoDB database, you will first need a hosted database on **MongoDB Atlas**, followed by deploying the NestJS API server on **Render**, and finally the Next.js portal on **Vercel**.

---

## 💾 Phase 1: Setup MongoDB Atlas (Database)

Render and Vercel do not include built-in MongoDB storage, so you need a free MongoDB Atlas cloud instance:

1. **Sign Up**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. **Create Cluster**: Select the **M0 Shared Free Tier** cluster, choose a cloud provider (e.g. AWS or Google Cloud), and select your nearest region.
3. **Database Security (Username/Password)**:
   - Create a database user. Record the **Username** and **Password** (avoid special characters in the password to prevent URI parsing errors).
4. **Network Access (IP Whitelist)**:
   - In the sidebar, click **Network Access** → **Add IP Address**.
   - Select **Allow Access From Anywhere** (`0.0.0.0/0`). This is necessary because Render's web services change outbound IPs dynamically.
5. **Get Connection String**:
   - Go to **Database** → click **Connect** on your cluster.
   - Choose **Drivers** (Node.js).
   - Copy the connection string. It will look like this:
     ```text
     mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```
   - Replace `<username>` and `<password>` with your database user credentials. Change the database name (usually before the `?`) to `student-admission`.

---

## 🖥️ Phase 2: Deploy NestJS Backend to Render

Render is ideal for hosting NestJS service runtimes:

1. **Sign Up**: Register at [Render](https://render.com/) and connect your GitHub account.
2. **Create Web Service**:
   - Click **New +** → **Web Service**.
   - Select your repository (`Student-Admission`).
3. **Configure Web Service**:
   - **Name**: `student-admission-api` (or any unique name).
   - **Environment**: `Node`
   - **Root Directory**: `backend` (⚠️ *Very Important: this points Render to the backend folder in the monorepo*).
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/main`
   - **Instance Type**: Select **Free**.
4. **Configure Environment Variables**:
   Click **Advanced** or navigate to the **Variables** tab on your Render dashboard, and add:
   - `MONGO_URI`: *Your MongoDB Atlas connection string from Phase 1.*
   - `JWT_SECRET`: *A secure random string (e.g., `45f8a0bdc6e2...`).*
   - `PORT`: `10000` (Render will map this automatically, but setting it explicitly is recommended).![alt text](image.png)
5. **Deploy**:
   - Render will build and deploy the NestJS API.
   - Once successfully deployed, Render will provide a public URL like:
     ```text
     https://student-admission-api.onrender.com
     ```
   - **Save this URL. You will need it for the frontend configuration.**

---

## 🎨 Phase 3: Deploy Next.js Frontend to Vercel

Vercel is the native hosting platform for Next.js:

1. **Sign Up**: Register at [Vercel](https://vercel.com/) and connect your GitHub account.
2. **Import Repository**:
   - Click **Add New** → **Project**.
   - Import your `Student-Admission` repository.
3. **Configure Project**:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click *Edit* and select the `frontend` folder (⚠️ *Very Important: this points Vercel to the frontend subdirectory*).
   - **Build & Development Settings**: Keep defaults (Vercel automatically detects Next.js build scripts).
4. **Configure Environment Variables**:
   Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL`: `https://student-admission-api.onrender.com/api` (⚠️ *Make sure to append `/api` to your Render URL from Phase 2*).
5. **Deploy**:
   - Click **Deploy**. Vercel will compile, run TypeScript checks, build static pages, and host the client portal.
   - Once completed, Vercel will provide you with a production domain (e.g., `https://student-admission.vercel.app`).

---

## 🧪 Phase 4: Seed Production Database (Optional)

To seed your production MongoDB database with the default Admission Team account (`admin@school.com` / `AdminPass123!`):

1. Open your terminal in the local repository's `backend` folder.
2. Temporarily edit your local `.env` file's `MONGO_URI` to point to your new **MongoDB Atlas connection string**.
3. Run the database seed script locally:
   ```bash
   npm run db:seed
   ```
4. Verify on the MongoDB Atlas dashboard collections tab that the users and exam slots have been created.
5. Revert your local `.env` connection string back to `mongodb://localhost:27017/student-admission` for local development.
