# DAYate

DAYate is a full-stack date-planning application. A user can create and
finalize a date plan, share it with another registered user, chat about the
plan, upload photos, and view those photos in a date calendar.

## Start Here

Read [docs/ARCHITECTURE_GUIDE.md](docs/ARCHITECTURE_GUIDE.md) for:

- a complete architecture map
- frontend, backend, and database responsibilities
- every API endpoint and access rule
- step-by-step feature flows
- known gaps and technical risks
- a practice roadmap for learning the project

## Technology

- Frontend: React 19, React Router, Vite, Tailwind CSS
- Backend: Node.js, Express 5, Mongoose
- Database: MongoDB
- Authentication: JWT and bcrypt
- Integrations: Cloudinary image storage and Gmail through Nodemailer

## Run Locally

Create environment files from the examples:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Fill in the backend secrets, then run each application in a separate terminal:

```bash
cd backend
npm install
npm run server
```

```bash
cd frontend
npm install
npm run dev
```

The frontend defaults to `http://localhost:5173` and the API defaults to
`http://localhost:5001`.

## Useful Commands

```bash
cd frontend && npm run build
cd frontend && npm run lint
cd backend && npm run server
```

There is currently no automated test suite.
