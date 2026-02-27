# Employer Features Documentation

## Overview

Phase 20 implements comprehensive employer features for the JobMatchAI platform, including company profile management, job posting, applicant management, and AI-powered candidate recommendations.

## Components Created

### 1. EmployerProfileForm (`src/components/employer/EmployerProfileForm.jsx`)
Company profile form with:
- Company logo upload with preview
- Company information (name, description, industry, size, website)
- Location details (address, city, state, zip, country)
- Contact information (email, phone)
- Form validation
- Image file validation (max 2MB)

### 2. JobPostForm (`src/components/employer/JobPostForm.jsx`)
Comprehensive job posting form with:
- Basic information (title, description, type, experience level, location)
- Requirements and responsibilities
- Skills management with tag-based input
- Salary range (min, max, currency)
- Benefits description
- Application deadline
- Form validation

### 3. ApplicantCard (`src/components/employer/ApplicantCard.jsx`)
Applicant display card showing:
- Applicant name and avatar
- Location information
- Match score with progress bar
- Application date
- Skills tags
- Status dropdown for updates
- Expandable details (phone, experience, cover letter)
- Resume download link

### 4. CandidateRecommendations (`src/components/employer/CandidateRecommendations.jsx`)
AI-powered candidate recommendations with:
- Search filters (skills, location, experience level)
- Match score display
- Match reasons explanation
- Candidate skills and experience
- Resume download
- Contact candidate button

## Pages Created

### 1. EmployerProfile (`src/pages/EmployerProfile.jsx`)
Company profile management page with:
- Create and update company profile
- Logo upload functionality
- Profile form with all fields
- Loading states
- Success/error notifications

### 2. PostJob (`src/pages/PostJob.jsx`)
Job posting page with:
- Create new job posting
- Edit existing job posting (via URL param)
- Job form with validation
- Redirect to jobs list after save
- Loading states

### 3. MyJobs (`src/pages/MyJobs.jsx`)
Job management page with:
- List all employer's job postings
- Job statistics (applicants, views)
- Status indicators (active/inactive)
- Quick actions:
  - View applicants
  - Edit job
  - Activate/deactivate
  - Delete job
- Empty state with call-to-action
- Post new job button

### 4. Applicants (`src/pages/Applicants.jsx`)
Applicant management page with:
- Job details header
- Filter by status (all, pending, reviewing, shortlisted, rejected, hired)
- Sort by date or match score
- Applicant cards with full details
- Status update functionality
- Pagination support
- Empty states

## API Integration

### Employer Profile Endpoints
- `GET /api/employer/profile` - Get company profile
- `POST /api/employer/profile` - Create profile
- `PUT /api/employer/profile` - Update profile
- `POST /api/upload/logo` - Upload company logo

### Job Endpoints
- `GET /api/jobs/my-jobs` - Get employer's jobs
- `POST /api/jobs` - Create job posting
- `GET /api/jobs/:jobId` - Get job details
- `PUT /api/jobs/:jobId` - Update job
- `DELETE /api/jobs/:jobId` - Delete job
- `PATCH /api/jobs/:jobId/status` - Update job status

### Application Endpoints
- `GET /api/applications/job/:jobId/applicants` - Get job applicants
  - Query params: `page`, `limit`, `status`, `sortBy`
- `PATCH /api/applications/:applicationId/status` - Update application status

### Candidate Recommendations Endpoints
- `GET /api/recommendations/candidates` - Get candidate recommendations
  - Query params: `jobId`, `skills`, `location`, `experienceLevel`

## Features

### Company Profile Management
1. **Create Profile**: Set up company information
2. **Edit Profile**: Update company details
3. **Logo Upload**: Upload and preview company logo
4. **Validation**: Required fields and format validation

### Job Posting
1. **Create Jobs**: Post new job openings
2. **Edit Jobs**: Update existing job postings
3. **Job Details**: Comprehensive job information
4. **Skills Management**: Add/remove required skills
5. **Salary Range**: Specify min/max salary
6. **Application Deadline**: Set closing date

### Job Management
1. **View All Jobs**: See all posted jobs
2. **Job Statistics**: View applicant count and views
3. **Status Control**: Activate/deactivate jobs
4. **Edit Jobs**: Update job details
5. **Delete Jobs**: Remove job postings
6. **Quick Access**: Direct link to applicants

### Applicant Management
1. **View Applicants**: See all job applicants
2. **Filter by Status**: Filter applications by status
3. **Sort Options**: Sort by date or match score
4. **Status Updates**: Change application status
5. **Applicant Details**: View full candidate information
6. **Resume Access**: Download applicant resumes
7. **Match Scores**: See AI-calculated compatibility

### Candidate Recommendations
1. **AI Matching**: Get recommended candidates
2. **Search Filters**: Filter by skills, location, experience
3. **Match Reasons**: Understand why candidates match
4. **Candidate Profiles**: View detailed candidate information
5. **Resume Access**: Download candidate resumes

## User Flow

### New Employer Flow
1. Register as employer
2. Redirected to company profile page
3. Upload company logo
4. Fill company information
5. Save profile
6. Post first job
7. View applicants as they apply
8. Manage application statuses

### Returning Employer Flow
1. Login
2. View dashboard
3. Check new applicants
4. Update application statuses
5. Post new jobs
6. Edit existing jobs
7. View candidate recommendations

## Validation Rules

### Company Profile
- Company name: Required
- Company description: Required
- Industry: Required
- Contact email: Required, valid email format
- Logo: Max 2MB, image files only

### Job Posting
- Job title: Required
- Description: Required
- Requirements: Required
- Location: Required
- Skills: At least 1 required
- Job type: Required (dropdown)
- Experience level: Required (dropdown)

## Status Management

### Job Statuses
- **Active**: Job is visible and accepting applications
- **Inactive**: Job is hidden from job seekers
- **Closed**: Job is no longer accepting applications

### Application Statuses
- **Pending**: New application, not yet reviewed
- **Reviewing**: Application under review
- **Shortlisted**: Candidate selected for next round
- **Rejected**: Application declined
- **Hired**: Candidate hired for position

Status colors match job seeker view for consistency.

## Routes Added

Protected routes for employers:
- `/employer/profile` - Company profile page
- `/employer/post-job` - Create new job posting
- `/employer/edit-job/:jobId` - Edit existing job
- `/employer/jobs` - My job postings
- `/employer/jobs/:jobId/applicants` - View applicants

## Styling

All components use Tailwind CSS with:
- Consistent color scheme (blue primary, gray neutrals)
- Responsive design (mobile-first)
- Hover states and transitions
- Loading states
- Empty states
- Status color coding

## Key Features

### Logo Upload
- Drag and drop or browse
- Image preview before upload
- File type validation (images only)
- Size validation (max 2MB)
- Automatic upload on form submit

### Skills Management
- Tag-based interface
- Add skills with Enter key or button
- Remove skills with × button
- No duplicate skills
- Visual feedback

### Applicant Filtering
- Filter by status (6 options)
- Sort by date or match score
- Pagination for large lists
- Real-time status updates
- Persistent filters across pages

### Match Scores
- Visual progress bars
- Percentage display
- Match reasons explanation
- AI-powered calculations
- Helps prioritize candidates

## Next Steps

Future enhancements:
- Bulk status updates
- Email templates for applicants
- Interview scheduling
- Applicant notes and ratings
- Team collaboration features
- Job posting templates
- Analytics dashboard
- Candidate messaging
- Video interview integration

## Testing

To test employer features:

1. Start backend and frontend servers
2. Register as an employer
3. Complete company profile:
   - Upload logo
   - Fill company information
   - Save profile
4. Post a job:
   - Fill job details
   - Add skills
   - Set salary range
   - Submit
5. View job postings
6. Manage applicants (requires job seeker applications)
7. Update application statuses
8. View candidate recommendations

## Notes

- All routes protected by authentication
- Role-based access control enforced
- Logo upload separate from profile save
- Job status changes are immediate
- Application status updates trigger notifications (backend)
- Match scores calculated by backend algorithm
- Candidate recommendations use AI matching
- Pagination improves performance for large datasets
