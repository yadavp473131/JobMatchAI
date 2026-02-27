# Job Seeker Features Documentation

## Overview

Phase 19 implements comprehensive job seeker features for the JobMatchAI platform, including profile management, resume upload with AI parsing, application tracking, saved jobs, and AI-powered job recommendations.

## Components Created

### 1. ProfileForm (`src/components/jobseeker/ProfileForm.jsx`)
Comprehensive profile form with:
- Personal information (name, phone, location)
- Skills management with tag-based input
- Dynamic experience array with add/remove functionality
- Dynamic education array with add/remove functionality
- Job preferences (job type, salary, relocation)
- Form validation
- Support for initial data (edit mode)

### 2. ResumeUpload (`src/components/jobseeker/ResumeUpload.jsx`)
Resume upload component with:
- Drag and drop file upload
- File type validation (PDF, DOC, DOCX)
- File size validation (max 5MB)
- Upload progress indication
- Resume preview with metadata
- Delete resume functionality
- AI resume parsing trigger
- Visual feedback for drag states

### 3. ApplicationCard (`src/components/jobseeker/ApplicationCard.jsx`)
Application display card showing:
- Job title and company
- Application status with color coding
- Application date
- Job location
- Match score with progress bar
- Link to job details

### 4. JobCard (`src/components/jobs/JobCard.jsx`)
Reusable job card component with:
- Job title, company, location
- Salary range formatting
- Job type and posting date
- Match score display (optional)
- Skills tags (first 5 + count)
- Save/unsave functionality
- View details button
- Responsive design

### 5. JobRecommendations (`src/components/jobseeker/JobRecommendations.jsx`)
AI-powered recommendations with:
- Personalized job recommendations
- Match score display
- Match reasons explanation
- Feedback mechanism (helpful/not helpful)
- Save/unsave jobs
- Refresh recommendations
- Empty state for incomplete profiles

## Pages Created

### 1. JobSeekerProfile (`src/pages/JobSeekerProfile.jsx`)
Complete profile management page with:
- Profile completeness indicator (0-100%)
- Resume upload section
- AI resume parsing integration
- Profile form with all fields
- Auto-fill from parsed resume data
- Create and update profile functionality
- Loading states

**Profile Completeness Calculation:**
- First Name: 10%
- Last Name: 10%
- Phone: 5%
- Location: 10%
- Skills: 20%
- Experience: 20%
- Education: 15%
- Resume: 10%

### 2. Applications (`src/pages/Applications.jsx`)
Application tracking page with:
- Filter tabs (All, Pending, Reviewing, Shortlisted, Rejected, Hired)
- Application cards with status
- Pagination support
- Empty states
- Link to browse jobs
- Responsive design

### 3. SavedJobs (`src/pages/SavedJobs.jsx`)
Saved jobs management with:
- List of saved jobs
- Unsave functionality
- Job cards with full details
- Empty state
- Link to browse jobs

## API Integration

### Profile Endpoints
- `GET /api/jobseeker/profile` - Get current profile
- `POST /api/jobseeker/profile` - Create profile
- `PUT /api/jobseeker/profile` - Update profile

### Resume Endpoints
- `POST /api/upload/resume` - Upload resume (multipart/form-data)
- `DELETE /api/upload/resume` - Delete resume
- `POST /api/resume-parser/parse` - Parse uploaded resume with AI

### Application Endpoints
- `GET /api/applications/my-applications` - Get user's applications
  - Query params: `page`, `limit`, `status`

### Saved Jobs Endpoints
- `GET /api/saved-jobs` - Get saved jobs
- `POST /api/saved-jobs/:jobId` - Save a job
- `DELETE /api/saved-jobs/:jobId` - Unsave a job

### Recommendations Endpoints
- `GET /api/recommendations/jobs` - Get job recommendations
- `POST /api/recommendations/feedback` - Submit recommendation feedback
  - Body: `{ jobId, helpful }`

## Features

### Profile Management
1. **Create Profile**: First-time users can create comprehensive profile
2. **Edit Profile**: Update any profile information
3. **Profile Completeness**: Visual indicator showing completion percentage
4. **Skills Management**: Add/remove skills with tag interface
5. **Experience Tracking**: Multiple work experiences with dates
6. **Education History**: Multiple education entries
7. **Job Preferences**: Job type, salary expectations, relocation

### Resume Management
1. **Upload**: Drag-and-drop or browse to upload
2. **Validation**: File type and size validation
3. **Preview**: View uploaded resume details
4. **Delete**: Remove resume from profile
5. **AI Parsing**: Extract information from resume automatically
6. **Auto-fill**: Parsed data auto-fills profile form

### Application Tracking
1. **View All**: See all job applications
2. **Filter by Status**: Filter by application status
3. **Status Colors**: Visual status indicators
4. **Match Score**: See how well you matched the job
5. **Application Date**: Track when you applied
6. **Pagination**: Navigate through multiple pages

### Saved Jobs
1. **Save Jobs**: Save interesting jobs for later
2. **View Saved**: See all saved jobs in one place
3. **Unsave**: Remove jobs from saved list
4. **Job Details**: Full job information displayed

### AI Recommendations
1. **Personalized**: Based on profile and preferences
2. **Match Score**: See compatibility percentage
3. **Match Reasons**: Understand why jobs match
4. **Feedback**: Rate recommendations to improve algorithm
5. **Save from Recommendations**: Save recommended jobs
6. **Refresh**: Get updated recommendations

## User Flow

### New Job Seeker Flow
1. Register as job seeker
2. Redirected to profile page
3. Upload resume (optional)
4. Parse resume with AI (optional)
5. Review and edit auto-filled information
6. Add additional skills, experience, education
7. Set job preferences
8. Save profile
9. View job recommendations
10. Browse and apply to jobs

### Returning Job Seeker Flow
1. Login
2. View dashboard with recommendations
3. Check application status
4. Browse saved jobs
5. Update profile as needed
6. Apply to new jobs

## Validation Rules

### Profile Form
- First name: Required
- Last name: Required
- Phone: Optional, but recommended
- Location: Optional
- Skills: At least 1 recommended
- Experience: At least 1 recommended
- Education: At least 1 recommended

### Resume Upload
- File types: PDF, DOC, DOCX only
- Max size: 5MB
- One resume per profile

### Skills
- No duplicates allowed
- Trimmed whitespace
- Case-sensitive

### Experience/Education
- Start date required
- End date required (unless current)
- Current checkbox disables end date

## Styling

All components use Tailwind CSS with:
- Consistent color scheme (blue primary, gray neutrals)
- Responsive design (mobile-first)
- Hover states and transitions
- Loading states
- Empty states
- Error states

## Status Colors

Application statuses use color coding:
- **Pending**: Yellow (bg-yellow-100, text-yellow-800)
- **Reviewing**: Blue (bg-blue-100, text-blue-800)
- **Shortlisted**: Green (bg-green-100, text-green-800)
- **Rejected**: Red (bg-red-100, text-red-800)
- **Hired**: Purple (bg-purple-100, text-purple-800)

## Routes Added

Protected routes for job seekers:
- `/profile` - Job seeker profile page
- `/applications` - My applications page
- `/saved-jobs` - Saved jobs page

## Next Steps

Future enhancements:
- Dashboard page with overview
- Job search and browse page
- Job details page with apply functionality
- Application withdrawal
- Profile visibility settings
- Resume templates
- Cover letter management
- Interview scheduling
- Notification preferences

## Testing

To test job seeker features:

1. Start backend and frontend servers
2. Register as a job seeker
3. Complete profile:
   - Upload resume
   - Parse resume
   - Add skills, experience, education
   - Set preferences
4. View recommendations
5. Save jobs
6. Apply to jobs
7. Track applications

## Notes

- Profile completeness affects recommendation quality
- Resume parsing requires OpenAI API key in backend
- Match scores calculated by backend algorithm
- Recommendations cached for 30 minutes
- All routes protected by authentication
- Role-based access control enforced
