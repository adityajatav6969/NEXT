# NextDevs: The Professional Network for Builders

NextDevs is a modern, production-ready full-stack application. It features a stunning Vite + React + Tailwind frontend, powered by a secure Node.js + Express + MongoDB backend, complete with real-time Socket.io streaming.

## Tech Stack
- **Frontend:** React 19, Vite, TailwindCSS, Zustand, Framer Motion, Axios, Socket.io-client.
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT Auth, Socket.io.

## Running Locally

You will need two terminals to run the full-stack environment.

### 1. Start the Backend Server
```bash
cd server
npm install
npm run dev
```
*Note: Make sure your local MongoDB instance is running, or replace the `MONGO_URI` in `server/.env` with your cloud MongoDB Atlas connection string.*

### 2. Start the Frontend Application
In a new terminal, from the project root:
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

## Deployment Instructions

To deploy this application to production (e.g., using **Vercel** for the frontend and **Render** / **Railway** for the backend):

### Backend Deployment (Render / Railway / AWS)
1. Push your code to GitHub.
2. Connect the repository to your hosting provider.
3. Set the Root Directory to `server`.
4. Add the following Environment Variables in the hosting dashboard:
   - `MONGO_URI` (Your MongoDB Atlas connection string)
   - `JWT_SECRET` (A strong, random secret key)
   - `PORT` (Usually provided dynamically, e.g., 5000)
5. Set the Build Command to `npm install` and the Start Command to `npm run start`.

### Frontend Deployment (Vercel / Netlify)
1. Once the backend is deployed, copy its public URL.
2. In your frontend repository, update the `baseURL` in `src/utils/api.js` and the `io` connection string in `src/pages/FeedPage.jsx` to point to the new backend URL instead of `http://localhost:5000`.
3. Connect your repository to Vercel.
4. Set the Framework Preset to Vite.
5. Deploy.

---
Built with modern best practices for performance, scalability, and an exceptional user experience.
