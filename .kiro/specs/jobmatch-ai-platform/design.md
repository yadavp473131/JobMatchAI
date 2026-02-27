# JobMatchAI Platform - Design Document

## 1. System Architecture

### 1.1 High-Level Architecture
```
┌─────────────────┐
│   React Frontend │
│   (Tailwind CSS) │
└────────┬────────┘
         │ HTTPS/REST
         │
┌────────▼────────┐
│  Express.js API  │
│   (Node.js)      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───┐
│MongoDB│  │ AI   │
│       │  │Service│
└───────┘  └──────┘
```

### 1.2 Technology Stack

**Frontend**:
- React 18.x
- Tailwind CSS 3.x
- React Router v6
- Axios
- React Hook Form
- React Query (for data fetching)
- Recharts (for analytics)
- React Toastify (notifications)

**Backend**:
- Node.js 18.x
- Express.js 4.x
- MongoDB 6.x
- Mongoose 7.x
- JWT (jsonwebtoken)
- Bcrypt
- Multer (file uploads)
- Nodemailer (emails)
- Express-validator

**AI/ML**:
- OpenAI API (GPT-4 for resume parsing)
- TensorFlow.js or Python microservice
- Natural language processing libraries

## 2. Database Design

### 2.1 MongoDB Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['jobseeker', 'employer', 'admin']),
  isVerified: Boolean,
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### JobSeekerProfiles Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  firstName: String,
  lastName: String,
  phone: String,
  location: {
    city: String,
    state: String,
    country: String
  },
  resume: {
    filename: String,
    path: String,
    uploadedAt: Date
  },
  skills: [String],
  experience: [{
    title: String,
    company: String,
    location: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    description: String
  }],
  education: [{
    degree: String,
    institution: String,
    field: String,
    startDate: Date,
    endDate: Date,
    current: Boolean
  }],
  preferences: {
    jobTypes: [String], // full-time, part-time, contract, remote
    desiredSalary: {
      min: Number,
      max: Number,
      currency: String
    },
    locations: [String],
    industries: [String]
  },
  profileVisibility: String (enum: ['public', 'private']),
  profileCompleteness: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### EmployerProfiles Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  companyName: String (required),
  companyDescription: String,
  companyLogo: String,
  industry: String,
  companySize: String,
  website: String,
  location: {
    address: String,
    city: String,
    state: String,
    country: String
  },
  contactPerson: {
    name: String,
    position: String,
    phone: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Jobs Collection
```javascript
{
  _id: ObjectId,
  employerId: ObjectId (ref: Users),
  title: String (required),
  description: String (required),
  requirements: [String],
  responsibilities: [String],
  skills: [String],
  experienceLevel: String (enum: ['entry', 'mid', 'senior', 'lead']),
  jobType: String (enum: ['full-time', 'part-time', 'contract', 'remote']),
  location: {
    city: String,
    state: String,
    country: String,
    remote: Boolean
  },
  salary: {
    min: Number,
    max: Number,
    currency: String,
    period: String (enum: ['hourly', 'monthly', 'yearly'])
  },
  benefits: [String],
  status: String (enum: ['active', 'inactive', 'closed']),
  expiresAt: Date,
  applicantCount: Number,
  viewCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### Applications Collection
```javascript
{
  _id: ObjectId,
  jobId: ObjectId (ref: Jobs),
  jobSeekerId: ObjectId (ref: Users),
  resume: {
    filename: String,
    path: String
  },
  coverLetter: String,
  status: String (enum: ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired']),
  matchScore: Number,
  matchReasons: [String],
  appliedAt: Date,
  statusHistory: [{
    status: String,
    changedAt: Date,
    changedBy: ObjectId
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### SavedJobs Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  jobId: ObjectId (ref: Jobs),
  savedAt: Date
}
```

#### Notifications Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  type: String (enum: ['application_status', 'new_match', 'new_applicant', 'system']),
  title: String,
  message: String,
  link: String,
  isRead: Boolean,
  createdAt: Date
}
```

### 2.2 Database Indexes
```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true })

// Jobs
db.jobs.createIndex({ employerId: 1 })
db.jobs.createIndex({ status: 1, expiresAt: 1 })
db.jobs.createIndex({ title: "text", description: "text" })
db.jobs.createIndex({ skills: 1 })
db.jobs.createIndex({ "location.city": 1, "location.state": 1 })

// Applications
db.applications.createIndex({ jobId: 1, jobSeekerId: 1 }, { unique: true })
db.applications.createIndex({ jobSeekerId: 1 })
db.applications.createIndex({ jobId: 1, status: 1 })

// JobSeekerProfiles
db.jobseekerprofiles.createIndex({ userId: 1 }, { unique: true })
db.jobseekerprofiles.createIndex({ skills: 1 })

// Notifications
db.notifications.createIndex({ userId: 1, createdAt: -1 })
```

## 3. API Design

### 3.1 Authentication Endpoints

```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/verify-email      - Verify email with token
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Reset password with token
GET    /api/auth/me                - Get current user
POST   /api/auth/logout            - Logout user
```

### 3.2 Job Seeker Endpoints

```
GET    /api/jobseekers/profile           - Get own profile
POST   /api/jobseekers/profile           - Create profile
PUT    /api/jobseekers/profile           - Update profile
POST   /api/jobseekers/resume            - Upload resume
DELETE /api/jobseekers/resume            - Delete resume
GET    /api/jobseekers/applications      - Get own applications
GET    /api/jobseekers/saved-jobs        - Get saved jobs
POST   /api/jobseekers/saved-jobs/:jobId - Save a job
DELETE /api/jobseekers/saved-jobs/:jobId - Unsave a job
GET    /api/jobseekers/recommendations   - Get AI job recommendations
```

### 3.3 Employer Endpoints

```
GET    /api/employers/profile              - Get own profile
POST   /api/employers/profile              - Create profile
PUT    /api/employers/profile              - Update profile
GET    /api/employers/jobs                 - Get own job postings
POST   /api/employers/jobs                 - Create job posting
PUT    /api/employers/jobs/:id             - Update job posting
DELETE /api/employers/jobs/:id             - Delete job posting
GET    /api/employers/jobs/:id/applicants  - Get applicants for job
PUT    /api/employers/applications/:id     - Update application status
GET    /api/employers/candidates           - Get AI candidate recommendations
```

### 3.4 Job Endpoints

```
GET    /api/jobs                - Search/list jobs (public)
GET    /api/jobs/:id            - Get job details
POST   /api/jobs/:id/apply      - Apply to job
GET    /api/jobs/:id/similar    - Get similar jobs
```

### 3.5 Notification Endpoints

```
GET    /api/notifications           - Get user notifications
PUT    /api/notifications/:id/read  - Mark notification as read
PUT    /api/notifications/read-all  - Mark all as read
DELETE /api/notifications/:id       - Delete notification
```

### 3.6 Admin Endpoints

```
GET    /api/admin/users             - Get all users
PUT    /api/admin/users/:id         - Update user
DELETE /api/admin/users/:id         - Delete user
GET    /api/admin/jobs              - Get all jobs
PUT    /api/admin/jobs/:id/moderate - Moderate job posting
GET    /api/admin/analytics         - Get platform analytics
```

## 4. AI Integration Design

### 4.1 Resume Parsing Service

**Flow**:
1. User uploads resume (PDF/DOC/DOCX)
2. Backend converts to text
3. Send to OpenAI API with structured prompt
4. Parse JSON response
5. Pre-fill profile fields
6. User reviews and confirms

**Prompt Template**:
```
Extract the following information from this resume and return as JSON:
- Personal info (name, email, phone, location)
- Skills (array of strings)
- Work experience (array with title, company, dates, description)
- Education (array with degree, institution, field, dates)

Resume text: {resume_text}
```

### 4.2 Job Matching Algorithm

**Scoring Factors**:
- Skills match (40%)
- Experience level match (25%)
- Location match (15%)
- Salary expectations (10%)
- Job type preference (10%)

**Implementation**:
```javascript
function calculateMatchScore(jobSeeker, job) {
  let score = 0;
  
  // Skills matching
  const matchingSkills = jobSeeker.skills.filter(skill => 
    job.skills.some(jobSkill => 
      jobSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );
  score += (matchingSkills.length / job.skills.length) * 40;
  
  // Experience level
  if (jobSeeker.experienceYears >= getMinExperience(job.experienceLevel)) {
    score += 25;
  }
  
  // Location
  if (job.location.remote || 
      jobSeeker.preferences.locations.includes(job.location.city)) {
    score += 15;
  }
  
  // Salary
  if (job.salary.min >= jobSeeker.preferences.desiredSalary.min &&
      job.salary.max <= jobSeeker.preferences.desiredSalary.max) {
    score += 10;
  }
  
  // Job type
  if (jobSeeker.preferences.jobTypes.includes(job.jobType)) {
    score += 10;
  }
  
  return Math.round(score);
}
```

### 4.3 Semantic Search

Use vector embeddings for better job search:
1. Generate embeddings for job descriptions
2. Generate embeddings for search queries
3. Calculate cosine similarity
4. Return top matches

## 5. Frontend Architecture

### 5.1 Component Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── Loader.jsx
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   └── ProtectedRoute.jsx
│   ├── jobseeker/
│   │   ├── ProfileForm.jsx
│   │   ├── ResumeUpload.jsx
│   │   ├── ApplicationCard.jsx
│   │   └── JobRecommendations.jsx
│   ├── employer/
│   │   ├── JobPostForm.jsx
│   │   ├── ApplicantList.jsx
│   │   └── CandidateRecommendations.jsx
│   └── jobs/
│       ├── JobCard.jsx
│       ├── JobDetails.jsx
│       ├── JobSearch.jsx
│       └── JobFilters.jsx
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── JobSeekerProfile.jsx
│   ├── EmployerProfile.jsx
│   ├── Jobs.jsx
│   ├── JobDetails.jsx
│   ├── Applications.jsx
│   ├── PostJob.jsx
│   └── NotFound.jsx
├── context/
│   ├── AuthContext.jsx
│   └── NotificationContext.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useJobs.js
│   └── useNotifications.js
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── jobService.js
│   └── profileService.js
├── utils/
│   ├── validators.js
│   ├── formatters.js
│   └── constants.js
├── App.jsx
└── index.js
```

### 5.2 Routing Structure

```javascript
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/jobs" element={<Jobs />} />
  <Route path="/jobs/:id" element={<JobDetails />} />
  
  {/* Protected Routes */}
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/applications" element={<Applications />} />
    <Route path="/saved-jobs" element={<SavedJobs />} />
    
    {/* Employer Only */}
    <Route element={<ProtectedRoute role="employer" />}>
      <Route path="/post-job" element={<PostJob />} />
      <Route path="/my-jobs" element={<MyJobs />} />
      <Route path="/applicants/:jobId" element={<Applicants />} />
    </Route>
    
    {/* Admin Only */}
    <Route element={<ProtectedRoute role="admin" />}>
      <Route path="/admin" element={<AdminDashboard />} />
    </Route>
  </Route>
</Routes>
```

## 6. Security Implementation

### 6.1 Authentication Flow

1. User submits credentials
2. Backend validates and generates JWT
3. JWT contains: userId, role, exp
4. Frontend stores JWT in httpOnly cookie or localStorage
5. Every API request includes JWT in Authorization header
6. Backend middleware verifies JWT
7. Request proceeds if valid, else 401 error

### 6.2 Authorization Middleware

```javascript
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    next();
  };
};
```

### 6.3 Input Validation

Use express-validator for all inputs:
```javascript
const validateJobPost = [
  body('title').trim().isLength({ min: 5, max: 100 }),
  body('description').trim().isLength({ min: 50 }),
  body('skills').isArray({ min: 1 }),
  body('salary.min').isNumeric(),
  // ... more validations
];
```

### 6.4 File Upload Security

```javascript
const upload = multer({
  storage: multer.diskStorage({
    destination: './uploads/resumes',
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
      cb(null, uniqueName + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, DOC, and DOCX files allowed'));
  }
});
```

## 7. UI/UX Design Principles

### 7.1 Color Scheme (Tailwind)
- Primary: Blue (600-700) - Trust, professionalism
- Secondary: Green (500-600) - Success, growth
- Accent: Purple (500) - Innovation, AI features
- Neutral: Gray (100-900) - Text, backgrounds
- Error: Red (500-600)
- Warning: Yellow (500)

### 7.2 Key Pages Layout

**Home Page**:
- Hero section with search bar
- Featured jobs
- How it works section
- Statistics (jobs posted, candidates hired)
- Call to action

**Job Search Page**:
- Left sidebar: Filters
- Main area: Job cards grid
- Top: Search bar and sort options
- Pagination at bottom

**Dashboard**:
- Top: Key metrics cards
- Middle: Recent activity
- Right sidebar: Recommendations
- Charts for analytics

### 7.3 Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 8. Testing Strategy

### 8.1 Backend Testing
- Unit tests for utilities and helpers
- Integration tests for API endpoints
- Test authentication and authorization
- Test database operations
- Test AI service integration

### 8.2 Frontend Testing
- Component unit tests (Jest + React Testing Library)
- Integration tests for user flows
- E2E tests for critical paths (Cypress)
- Accessibility testing

### 8.3 Property-Based Testing Framework
- **Framework**: fast-check (JavaScript/TypeScript)
- **Test Runner**: Jest
- **Coverage**: Core business logic and AI matching algorithms

## 9. Deployment Architecture

### 9.1 Environment Setup
- Development: Local MongoDB, local Node server
- Staging: Cloud MongoDB, Cloud hosting (Heroku/Railway)
- Production: MongoDB Atlas, AWS/Vercel/Railway

### 9.2 CI/CD Pipeline
1. Code push to GitHub
2. Run linting and tests
3. Build frontend and backend
4. Deploy to staging
5. Run E2E tests
6. Manual approval for production
7. Deploy to production

### 9.3 Environment Variables
```
# Backend
PORT=5000
MONGODB_URI=mongodb://...
JWT_SECRET=...
JWT_EXPIRE=7d
EMAIL_HOST=...
EMAIL_PORT=...
EMAIL_USER=...
EMAIL_PASS=...
OPENAI_API_KEY=...
CLIENT_URL=http://localhost:3000

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
```

## 10. Performance Optimization

### 10.1 Backend
- Use MongoDB aggregation for complex queries
- Implement Redis caching for frequent queries
- Paginate all list endpoints
- Use lean() for read-only queries
- Implement rate limiting

### 10.2 Frontend
- Code splitting with React.lazy()
- Image optimization and lazy loading
- Debounce search inputs
- Use React Query for caching
- Minimize bundle size

## 11. Correctness Properties

### 11.1 Authentication Properties
**Property 1.1**: Users cannot access protected routes without valid authentication
**Property 1.2**: Users can only access resources allowed by their role
**Property 1.3**: Password hashes are never exposed in API responses

### 11.2 Application Properties
**Property 2.1**: A job seeker cannot apply to the same job twice
**Property 2.2**: Application status transitions follow valid workflow (pending → reviewing → shortlisted/rejected → hired)
**Property 2.3**: Only the employer who posted a job can modify application statuses

### 11.3 Job Posting Properties
**Property 3.1**: Only employers can create job postings
**Property 3.2**: Job postings must have all required fields (title, description, skills)
**Property 3.3**: Expired jobs are not shown in active job searches

### 11.4 Matching Algorithm Properties
**Property 4.1**: Match scores are always between 0 and 100
**Property 4.2**: Higher skill overlap results in higher match scores
**Property 4.3**: Match score calculation is deterministic for same inputs

### 11.5 Data Integrity Properties
**Property 5.1**: Deleting a user cascades to delete their profile and applications
**Property 5.2**: Email addresses are unique across all users
**Property 5.3**: File uploads are validated for type and size before storage

## 12. Monitoring and Logging

### 12.1 Logging Strategy
- Use Winston for structured logging
- Log levels: error, warn, info, debug
- Log all API requests and responses
- Log authentication attempts
- Log AI service calls and responses

### 12.2 Monitoring
- Track API response times
- Monitor database query performance
- Track error rates
- Monitor AI service usage and costs
- Set up alerts for critical errors

## 13. Documentation Requirements

- API documentation (Swagger/OpenAPI)
- README with setup instructions
- Environment variable documentation
- Database schema documentation
- Component documentation (Storybook)
- User guide for key features
