# JobMatchAI Platform - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All responses follow this structure:
```json
{
  "success": true/false,
  "message": "Description of the result",
  "data": { ... },
  "error": "Error message (if applicable)"
}
```

---

## Table of Contents
1. [Authentication](#authentication-endpoints)
2. [Job Seeker Profile](#job-seeker-profile-endpoints)
3. [Employer Profile](#employer-profile-endpoints)
4. [Jobs](#job-endpoints)
5. [Applications](#application-endpoints)
6. [Saved Jobs](#saved-jobs-endpoints)
7. [Resume Parser](#resume-parser-endpoints)
8. [Recommendations](#recommendation-endpoints)
9. [Notifications](#notification-endpoints)
10. [Dashboard](#dashboard-endpoints)
11. [Admin](#admin-endpoints)
12. [File Upload](#file-upload-endpoints)

---

## Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "jobseeker" // or "employer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "role": "jobseeker",
      "isVerified": false
    }
  }
}
```

### Login
```http
POST /auth/login
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "role": "jobseeker"
    }
  }
}
```

### Verify Email
```http
GET /auth/verify-email/:token
```

### Forgot Password
```http
POST /auth/forgot-password
```

**Body:**
```json
{
  "email": "user@example.com"
}
```

### Reset Password
```http
POST /auth/reset-password/:token
```

**Body:**
```json
{
  "password": "newpassword123"
}
```

---

## Job Seeker Profile Endpoints

### Create Profile
```http
POST /jobseekers/profile
```
**Auth:** Required (Job Seeker)

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "location": "San Francisco, CA",
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": [
    {
      "title": "Software Engineer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "startDate": "2020-01-01",
      "endDate": "2023-01-01",
      "current": false,
      "description": "Developed web applications"
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Science",
      "institution": "University of California",
      "field": "Computer Science",
      "startDate": "2016-09-01",
      "endDate": "2020-05-01"
    }
  ],
  "preferences": {
    "jobType": "full-time",
    "minSalary": 80000,
    "maxSalary": 120000,
    "remoteWork": true,
    "willingToRelocate": false
  }
}
```

### Get Profile
```http
GET /jobseekers/profile
```
**Auth:** Required (Job Seeker)

### Update Profile
```http
PUT /jobseekers/profile
```
**Auth:** Required (Job Seeker)

### Create Profile from Resume
```http
POST /jobseekers/profile/from-resume
```
**Auth:** Required (Job Seeker)

**Body:**
```json
{
  "personalInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "San Francisco, CA"
  },
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": [...],
  "education": [...]
}
```

### Add Skills
```http
POST /jobseekers/profile/skills
```
**Auth:** Required (Job Seeker)

**Body:**
```json
{
  "skills": ["Python", "Django"]
}
```

### Remove Skill
```http
DELETE /jobseekers/profile/skills/:skill
```
**Auth:** Required (Job Seeker)

### Add Experience
```http
POST /jobseekers/profile/experience
```
**Auth:** Required (Job Seeker)

### Update Experience
```http
PUT /jobseekers/profile/experience/:id
```
**Auth:** Required (Job Seeker)

### Delete Experience
```http
DELETE /jobseekers/profile/experience/:id
```
**Auth:** Required (Job Seeker)

### Add Education
```http
POST /jobseekers/profile/education
```
**Auth:** Required (Job Seeker)

### Update Education
```http
PUT /jobseekers/profile/education/:id
```
**Auth:** Required (Job Seeker)

### Delete Education
```http
DELETE /jobseekers/profile/education/:id
```
**Auth:** Required (Job Seeker)

---

## Employer Profile Endpoints

### Create Employer Profile
```http
POST /employers/profile
```
**Auth:** Required (Employer)

**Body:**
```json
{
  "companyName": "Tech Corp",
  "companyDescription": "Leading tech company",
  "industry": "Technology",
  "companySize": "100-500",
  "website": "https://techcorp.com",
  "location": "San Francisco, CA",
  "contactEmail": "hr@techcorp.com",
  "contactPhone": "+1234567890"
}
```

### Get Employer Profile
```http
GET /employers/profile
```
**Auth:** Required (Employer)

### Update Employer Profile
```http
PUT /employers/profile
```
**Auth:** Required (Employer)

---

## Job Endpoints

### Create Job
```http
POST /jobs
```
**Auth:** Required (Employer)

**Body:**
```json
{
  "title": "Senior Software Engineer",
  "description": "We are looking for an experienced software engineer...",
  "requirements": "5+ years of experience with JavaScript...",
  "responsibilities": "Design and develop scalable applications...",
  "requiredSkills": ["JavaScript", "React", "Node.js"],
  "experienceLevel": "senior",
  "jobType": "full-time",
  "location": "San Francisco, CA",
  "salaryMin": 120000,
  "salaryMax": 180000,
  "benefits": ["Health insurance", "401k", "Remote work"],
  "expiresAt": "2024-12-31"
}
```

### Get All Jobs
```http
GET /jobs?page=1&limit=10&search=engineer&location=San Francisco&jobType=full-time&experienceLevel=senior&minSalary=100000&maxSalary=150000&skills=JavaScript,React&sortBy=createdAt&sortOrder=desc
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `search` - Search in title and description
- `location` - Filter by location
- `jobType` - full-time, part-time, contract, remote
- `experienceLevel` - entry, junior, mid, senior, lead
- `minSalary` - Minimum salary
- `maxSalary` - Maximum salary
- `skills` - Comma-separated list
- `sortBy` - createdAt, salaryMin, applicantCount
- `sortOrder` - asc, desc

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

### Get Job by ID
```http
GET /jobs/:id
```

### Update Job
```http
PUT /jobs/:id
```
**Auth:** Required (Employer - must own job)

### Delete Job
```http
DELETE /jobs/:id
```
**Auth:** Required (Employer - must own job)

### Update Job Status
```http
PATCH /jobs/:id/status
```
**Auth:** Required (Employer - must own job)

**Body:**
```json
{
  "status": "active" // or "inactive", "closed"
}
```

---

## Application Endpoints

### Apply to Job
```http
POST /applications
```
**Auth:** Required (Job Seeker)

**Body:**
```json
{
  "jobId": "job_id_here",
  "coverLetter": "I am very interested in this position..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "application": {
      "_id": "application_id",
      "jobId": "job_id",
      "jobSeekerId": "user_id",
      "status": "pending",
      "appliedAt": "2024-01-01T00:00:00.000Z"
    },
    "matchScore": 85
  }
}
```

### Get My Applications
```http
GET /applications/my-applications?page=1&limit=10&status=pending
```
**Auth:** Required (Job Seeker)

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `status` - pending, reviewing, shortlisted, rejected, hired

### Get Job Applicants
```http
GET /applications/job/:jobId/applicants?page=1&limit=10&status=pending&sortBy=matchScore&sortOrder=desc
```
**Auth:** Required (Employer - must own job)

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `status` - Filter by status
- `sortBy` - appliedAt, matchScore
- `sortOrder` - asc, desc

### Update Application Status
```http
PATCH /applications/:id/status
```
**Auth:** Required (Employer - must own job)

**Body:**
```json
{
  "status": "reviewing", // pending, reviewing, shortlisted, rejected, hired
  "notes": "Candidate looks promising"
}
```

### Get Application Analytics
```http
GET /applications/analytics/:jobId
```
**Auth:** Required (Employer - must own job)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalApplications": 50,
    "byStatus": {
      "pending": 10,
      "reviewing": 15,
      "shortlisted": 10,
      "rejected": 10,
      "hired": 5
    },
    "responseRate": 80,
    "avgTimeToHire": 14,
    "trends": [...]
  }
}
```

---

## Saved Jobs Endpoints

### Save Job
```http
POST /saved-jobs/:jobId
```
**Auth:** Required (Job Seeker)

### Unsave Job
```http
DELETE /saved-jobs/:jobId
```
**Auth:** Required (Job Seeker)

### Get Saved Jobs
```http
GET /saved-jobs?page=1&limit=10
```
**Auth:** Required (Job Seeker)

---

## Resume Parser Endpoints

### Parse Resume
```http
POST /resume-parser/parse
```
**Auth:** Required (Job Seeker)

**Content-Type:** multipart/form-data

**Body:**
- `resume` - File (PDF, DOC, DOCX)

**Response:**
```json
{
  "success": true,
  "message": "Resume parsed successfully",
  "data": {
    "personalInfo": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "location": "San Francisco, CA"
    },
    "skills": ["JavaScript", "React", "Node.js"],
    "experience": [...],
    "education": [...]
  }
}
```

---

## Recommendation Endpoints

### Get Job Recommendations
```http
GET /recommendations/jobs?limit=10&minScore=50
```
**Auth:** Required (Job Seeker)

**Query Parameters:**
- `limit` (default: 10)
- `minScore` (default: 0) - Minimum match score

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "job": {...},
        "matchScore": 85,
        "matchBreakdown": {
          "skills": { "score": 90, "weight": 0.35 },
          "experience": { "score": 80, "weight": 0.25 },
          "location": { "score": 100, "weight": 0.15 },
          "salary": { "score": 75, "weight": 0.15 },
          "jobType": { "score": 100, "weight": 0.10 }
        },
        "matchReasons": [
          "5/5 skills match",
          "Perfect match: 5 years experience for senior level",
          "Same location"
        ]
      }
    ],
    "total": 10,
    "profileCompleteness": 85
  },
  "cached": false
}
```

### Get Candidate Recommendations
```http
GET /recommendations/candidates/:jobId?limit=10&minScore=50
```
**Auth:** Required (Employer)

### Search Candidates
```http
GET /recommendations/candidates/search?skills=JavaScript,React&location=San Francisco&minExperience=3&maxExperience=7&jobId=job_id&page=1&limit=20
```
**Auth:** Required (Employer)

**Query Parameters:**
- `skills` - Comma-separated list
- `location` - Location search
- `minExperience` - Minimum years
- `maxExperience` - Maximum years
- `jobId` - Optional, to calculate match scores
- `page` (default: 1)
- `limit` (default: 20)

### Submit Recommendation Feedback
```http
POST /recommendations/feedback
```
**Auth:** Required (Job Seeker)

**Body:**
```json
{
  "jobId": "job_id",
  "matchScore": 85,
  "rating": "helpful", // helpful, not_helpful, irrelevant
  "comment": "Great recommendation!"
}
```

### Get Feedback Statistics
```http
GET /recommendations/feedback/stats
```
**Auth:** Required (Admin)

---

## Notification Endpoints

### Get Notifications
```http
GET /notifications?page=1&limit=20&isRead=false
```
**Auth:** Required

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `isRead` - Filter by read status

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "notification_id",
        "type": "application_status",
        "title": "Application Status Update",
        "message": "Your application for Senior Engineer has been shortlisted",
        "link": "/applications/app_id",
        "isRead": false,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "unreadCount": 5,
    "pagination": {...}
  }
}
```

### Get Unread Count
```http
GET /notifications/unread-count
```
**Auth:** Required

### Mark as Read
```http
PATCH /notifications/:id/read
```
**Auth:** Required

### Mark All as Read
```http
PATCH /notifications/read-all
```
**Auth:** Required

### Delete Notification
```http
DELETE /notifications/:id
```
**Auth:** Required

---

## Dashboard Endpoints

### Job Seeker Dashboard
```http
GET /dashboard/jobseeker
```
**Auth:** Required (Job Seeker)

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "completeness": 85,
      "skills": 10,
      "experience": 3,
      "education": 2
    },
    "statistics": {
      "totalApplications": 15,
      "statusCounts": {
        "pending": 5,
        "reviewing": 3,
        "shortlisted": 2,
        "rejected": 3,
        "hired": 2
      },
      "responseRate": 67
    },
    "recentApplications": [...],
    "topRecommendations": [...]
  }
}
```

### Employer Dashboard
```http
GET /dashboard/employer
```
**Auth:** Required (Employer)

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "companyName": "Tech Corp",
      "location": "San Francisco, CA"
    },
    "statistics": {
      "totalJobs": 10,
      "jobStatusCounts": {
        "active": 5,
        "inactive": 3,
        "closed": 2
      },
      "totalApplicants": 150,
      "totalViews": 1500,
      "applicationStatusCounts": {...}
    },
    "recentApplications": [...],
    "topJobs": [...]
  }
}
```

### Admin Analytics
```http
GET /dashboard/admin
```
**Auth:** Required (Admin)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 1000,
      "byRole": {
        "jobseeker": 700,
        "employer": 290,
        "admin": 10
      },
      "newUsersLast30Days": 50
    },
    "jobs": {
      "total": 500,
      "active": 300,
      "byType": [...],
      "newJobsLast7Days": 20
    },
    "applications": {
      "total": 5000,
      "byStatus": {...},
      "newApplicationsLast7Days": 150
    },
    "metrics": {
      "avgApplicationsPerJob": 10,
      "hireRate": 5.5
    }
  }
}
```

---

## Admin Endpoints

### Get All Users
```http
GET /admin/users?page=1&limit=20&role=jobseeker&isVerified=true&isBanned=false&search=john
```
**Auth:** Required (Admin)

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `role` - jobseeker, employer, admin
- `isVerified` - true, false
- `isBanned` - true, false
- `search` - Search in email, firstName, lastName

### Get User Details
```http
GET /admin/users/:id
```
**Auth:** Required (Admin)

### Update User
```http
PUT /admin/users/:id
```
**Auth:** Required (Admin)

**Body:**
```json
{
  "email": "newemail@example.com",
  "role": "employer",
  "isVerified": true
}
```

### Delete User
```http
DELETE /admin/users/:id
```
**Auth:** Required (Admin)

### Ban/Unban User
```http
PATCH /admin/users/:id/ban
```
**Auth:** Required (Admin)

**Body:**
```json
{
  "isBanned": true
}
```

### Get All Jobs (Admin)
```http
GET /admin/jobs?page=1&limit=20&status=active&search=engineer
```
**Auth:** Required (Admin)

### Delete Job (Admin)
```http
DELETE /admin/jobs/:id
```
**Auth:** Required (Admin)

### Update Job Status (Admin)
```http
PATCH /admin/jobs/:id/status
```
**Auth:** Required (Admin)

**Body:**
```json
{
  "status": "inactive"
}
```

---

## File Upload Endpoints

### Upload Resume
```http
POST /upload/resume
```
**Auth:** Required (Job Seeker)

**Content-Type:** multipart/form-data

**Body:**
- `resume` - File (PDF, DOC, DOCX, max 5MB)

**Response:**
```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "data": {
    "filename": "resume_1234567890.pdf",
    "path": "/uploads/resumes/resume_1234567890.pdf",
    "size": 1024000
  }
}
```

### Upload Company Logo
```http
POST /upload/logo
```
**Auth:** Required (Employer)

**Content-Type:** multipart/form-data

**Body:**
- `logo` - Image file (JPG, PNG, max 2MB)

### Delete File
```http
DELETE /upload/:filename
```
**Auth:** Required

### Get File
```http
GET /upload/:filename
```
**Auth:** Required

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found |
| 500 | Internal Server Error |

## Common Error Responses

### Authentication Error
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Email is required"
}
```

### Not Found Error
```json
{
  "success": false,
  "message": "Resource not found"
}
```

---

## Rate Limiting
- Currently no rate limiting implemented
- Recommended: 100 requests per 15 minutes per IP

## Pagination
All list endpoints support pagination with these query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10-20 depending on endpoint)

Response includes pagination metadata:
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Caching
- Job recommendations are cached for 30 minutes
- Cache is automatically invalidated when profile is updated
- Cached responses include `"cached": true` field

---

## Testing the API

### Using cURL
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"jobseeker"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get jobs (with auth)
curl -X GET http://localhost:5000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman
1. Import the endpoints into Postman
2. Set up environment variables for base URL and token
3. Use the Authorization tab to set Bearer token

---

## Notes
- All dates are in ISO 8601 format
- All monetary values are in USD
- File uploads use multipart/form-data
- Most endpoints return JSON
- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- Email verification tokens expire after 24 hours
- Password reset tokens expire after 1 hour

---

**Last Updated:** January 2024
**API Version:** 1.0.0
**Base URL:** http://localhost:5000/api
