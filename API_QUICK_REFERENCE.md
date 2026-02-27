# JobMatchAI API - Quick Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication
```
Authorization: Bearer <token>
```

---

## Quick Endpoint List

### 🔐 Authentication (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| GET | `/auth/verify-email/:token` | Verify email |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password/:token` | Reset password |

### 👤 Job Seeker Profile (Auth: Job Seeker)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/jobseekers/profile` | Create profile |
| GET | `/jobseekers/profile` | Get profile |
| PUT | `/jobseekers/profile` | Update profile |
| POST | `/jobseekers/profile/from-resume` | Create from parsed resume |
| POST | `/jobseekers/profile/skills` | Add skills |
| DELETE | `/jobseekers/profile/skills/:skill` | Remove skill |
| POST | `/jobseekers/profile/experience` | Add experience |
| PUT | `/jobseekers/profile/experience/:id` | Update experience |
| DELETE | `/jobseekers/profile/experience/:id` | Delete experience |
| POST | `/jobseekers/profile/education` | Add education |
| PUT | `/jobseekers/profile/education/:id` | Update education |
| DELETE | `/jobseekers/profile/education/:id` | Delete education |

### 🏢 Employer Profile (Auth: Employer)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/employers/profile` | Create profile |
| GET | `/employers/profile` | Get profile |
| PUT | `/employers/profile` | Update profile |

### 💼 Jobs
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/jobs` | Public | List all jobs |
| GET | `/jobs/:id` | Public | Get job details |
| POST | `/jobs` | Employer | Create job |
| PUT | `/jobs/:id` | Employer | Update job |
| DELETE | `/jobs/:id` | Employer | Delete job |
| PATCH | `/jobs/:id/status` | Employer | Update status |

### 📝 Applications
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/applications` | Job Seeker | Apply to job |
| GET | `/applications/my-applications` | Job Seeker | Get my applications |
| GET | `/applications/job/:jobId/applicants` | Employer | Get job applicants |
| PATCH | `/applications/:id/status` | Employer | Update status |
| GET | `/applications/analytics/:jobId` | Employer | Get analytics |

### ⭐ Saved Jobs (Auth: Job Seeker)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/saved-jobs/:jobId` | Save job |
| DELETE | `/saved-jobs/:jobId` | Unsave job |
| GET | `/saved-jobs` | Get saved jobs |

### 📄 Resume Parser (Auth: Job Seeker)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/resume-parser/parse` | Parse resume file |

### 🎯 Recommendations
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/recommendations/jobs` | Job Seeker | Get job recommendations |
| GET | `/recommendations/candidates/:jobId` | Employer | Get candidate recommendations |
| GET | `/recommendations/candidates/search` | Employer | Search candidates |
| POST | `/recommendations/feedback` | Job Seeker | Submit feedback |
| GET | `/recommendations/feedback/stats` | Admin | Get feedback stats |

### 🔔 Notifications (Auth: Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | Get notifications |
| GET | `/notifications/unread-count` | Get unread count |
| PATCH | `/notifications/:id/read` | Mark as read |
| PATCH | `/notifications/read-all` | Mark all as read |
| DELETE | `/notifications/:id` | Delete notification |

### 📊 Dashboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard/jobseeker` | Job Seeker | Get dashboard |
| GET | `/dashboard/employer` | Employer | Get dashboard |
| GET | `/dashboard/admin` | Admin | Get analytics |

### 👨‍💼 Admin (Auth: Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | List all users |
| GET | `/admin/users/:id` | Get user details |
| PUT | `/admin/users/:id` | Update user |
| DELETE | `/admin/users/:id` | Delete user |
| PATCH | `/admin/users/:id/ban` | Ban/unban user |
| GET | `/admin/jobs` | List all jobs |
| DELETE | `/admin/jobs/:id` | Delete job |
| PATCH | `/admin/jobs/:id/status` | Update job status |

### 📁 File Upload
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/upload/resume` | Job Seeker | Upload resume |
| POST | `/upload/logo` | Employer | Upload logo |
| DELETE | `/upload/:filename` | Required | Delete file |
| GET | `/upload/:filename` | Required | Get file |

---

## Common Query Parameters

### Pagination
```
?page=1&limit=10
```

### Job Search
```
?search=engineer
&location=San Francisco
&jobType=full-time
&experienceLevel=senior
&minSalary=100000
&maxSalary=150000
&skills=JavaScript,React
&sortBy=createdAt
&sortOrder=desc
```

### Filtering
```
?status=active
&isVerified=true
&isBanned=false
&role=jobseeker
```

---

## Response Structure

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### With Pagination
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

---

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Application Status Flow
```
pending → reviewing → shortlisted → hired
                   ↘ rejected
```

## Job Status
- `active` - Accepting applications
- `inactive` - Not visible
- `closed` - No longer accepting

---

## Match Score Breakdown
```json
{
  "score": 85,
  "breakdown": {
    "skills": { "score": 90, "weight": 0.35 },
    "experience": { "score": 80, "weight": 0.25 },
    "location": { "score": 100, "weight": 0.15 },
    "salary": { "score": 75, "weight": 0.15 },
    "jobType": { "score": 100, "weight": 0.10 }
  },
  "reasons": [
    "5/5 skills match",
    "Perfect experience level",
    "Same location"
  ]
}
```

---

## File Upload Limits
- **Resume:** PDF, DOC, DOCX - Max 5MB
- **Logo:** JPG, PNG - Max 2MB

---

## Quick Test Commands

### Register & Login
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"jobseeker"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Jobs
```bash
curl -X GET "http://localhost:5000/api/jobs?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Profile
```bash
curl -X POST http://localhost:5000/api/jobseekers/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","skills":["JavaScript"]}'
```

---

## Environment Variables Required
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobmatchai
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_password
OPENAI_API_KEY=your_openai_key
CLIENT_URL=http://localhost:3000
```

---

**Total Endpoints:** 70+
**Authentication Methods:** JWT Bearer Token
**API Version:** 1.0.0
