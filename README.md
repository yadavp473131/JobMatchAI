# JobMatchAI Platform

An AI-powered job matching platform built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- Role-based authentication (Job Seekers, Employers, Admin)
- AI-powered resume parsing
- Intelligent job matching algorithm
- Job search and filtering
- Application management
- Real-time notifications
- Dashboard analytics

## Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- OpenAI API Integration

**Frontend:**
- React 19
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- TanStack Query (React Query)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd JobMatchAI
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install --legacy-peer-deps
```

4. Configure environment variables

Backend - Create `backend/.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobmatchai
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
OPENAI_API_KEY=your_openai_api_key
CLIENT_URL=http://localhost:3000
```

### Running the Application

1. Start MongoDB (if running locally)
```bash
mongod
```

2. Start the backend server
```bash
cd backend
npm run dev
```

3. Start the frontend development server
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
JobMatchAI/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # React components
│       ├── context/     # Context providers
│       ├── hooks/       # Custom hooks
│       ├── pages/       # Page components
│       ├── services/    # API services
│       └── utils/       # Utility functions
└── .kiro/specs/         # Project specifications
```

## Development

- Backend runs on port 5000 with nodemon for auto-reload
- Frontend runs on port 3000 with hot module replacement
- API requests from frontend are proxied to backend

## License

MIT
