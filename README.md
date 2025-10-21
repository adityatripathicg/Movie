# Movie Magic Rebuilt

Full-stack movie management application with authentication and image upload.

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS, JavaScript
- **Backend:** NestJS, TypeScript
- **Database:** MongoDB Atlas
- **Storage:** Cloudinary

## Features

- User authentication
- Create, edit, delete movies
- Upload movie posters
- Pagination
- Responsive design

## Quick Setup

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:
```
PORT=4000
JWT_SECRET=your-secret-key
MONGODB_URI=your-mongodb-connection-string
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:3000
```

Start backend:
```bash
npm run start:dev
```

### 2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Start frontend:
```bash
npm run dev
```

### 3. Open App

http://localhost:3000

 ## Demo Account Credentials :

demo@gmail.com
demo123

