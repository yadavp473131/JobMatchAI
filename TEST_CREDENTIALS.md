# JobMatchAI - Test Credentials

## How to Seed the Database

Run the following command from the backend directory:

```bash
cd backend
node seedData.js
```

This will populate the database with sample users, profiles, jobs, and applications.

---

## Test Accounts

### 👤 Admin Account

**Email:** `admin@jobmatchai.com`  
**Password:** `admin123`  
**Role:** Admin  
**Access:** Full platform access, user management, job moderation

---

### 👨‍💼 Job Seeker Accounts

All job seekers use the password: **`password123`**

#### 1. John Doe
- **Email:** `john.doe@email.com`
- **Password:** `password123`
- **Profile:** Senior Full Stack Developer
- **Location:** San Francisco, CA
- **Skills:** JavaScript, React, Node.js, MongoDB, Express, TypeScript, AWS
- **Experience:** 5+ years
- **Desired Salary:** $110,000 - $140,000
- **Has Applications:** Yes (1 application - Shortlisted)
- **Has Saved Jobs:** Yes (2 saved jobs)

#### 2. Sarah Smith
- **Email:** `sarah.smith@email.com`
- **Password:** `password123`
- **Profile:** Backend Developer
- **Location:** New York, NY
- **Skills:** Python, Django, PostgreSQL, Docker, Kubernetes, Machine Learning
- **Experience:** 4+ years
- **Desired Salary:** $120,000 - $150,000
- **Has Applications:** Yes (2 applications)

#### 3. Mike Johnson
- **Email:** `mike.johnson@email.com`
- **Password:** `password123`
- **Profile:** Software Engineer
- **Location:** Austin, TX
- **Skills:** Java, Spring Boot, Microservices, MySQL, Redis, Kafka
- **Experience:** 3+ years
- **Desired Salary:** $100,000 - $130,000
- **Has Applications:** Yes (1 application)
- **Has Saved Jobs:** Yes (1 saved job)

#### 4. Emily Davis
- **Email:** `emily.davis@email.com`
- **Password:** `password123`
- **Profile:** Frontend Developer
- **Location:** Seattle, WA
- **Skills:** React, Vue.js, CSS, HTML, JavaScript, UI/UX Design, Figma
- **Experience:** 3+ years
- **Desired Salary:** $85,000 - $110,000
- **Has Applications:** Yes (1 application)

#### 5. David Wilson
- **Email:** `david.wilson@email.com`
- **Password:** `password123`
- **Profile:** DevOps Engineer
- **Location:** Boston, MA
- **Skills:** DevOps, AWS, Terraform, Jenkins, Docker, Kubernetes, Linux
- **Experience:** 4+ years
- **Desired Salary:** $115,000 - $145,000
- **Has Applications:** Yes (1 application)

---

### 🏢 Employer Accounts

All employers use the password: **`employer123`**

#### 1. TechCorp Solutions
- **Email:** `hr@techcorp.com`
- **Password:** `employer123`
- **Company:** TechCorp Solutions
- **Industry:** Technology
- **Size:** 201-500 employees
- **Location:** San Francisco, CA
- **Website:** https://www.techcorp.com
- **Active Jobs:** 2 (Senior Full Stack Developer, Frontend Developer)
- **Total Applicants:** 3

#### 2. InnovateAI
- **Email:** `hiring@innovateai.com`
- **Password:** `employer123`
- **Company:** InnovateAI
- **Industry:** Artificial Intelligence
- **Size:** 51-200 employees
- **Location:** New York, NY
- **Website:** https://www.innovateai.com
- **Active Jobs:** 2 (Machine Learning Engineer, DevOps Engineer)
- **Total Applicants:** 2

#### 3. Startup Ventures
- **Email:** `jobs@startupventures.com`
- **Password:** `employer123`
- **Company:** Startup Ventures
- **Industry:** Software
- **Size:** 11-50 employees
- **Location:** Austin, TX
- **Website:** https://www.startupventures.com
- **Active Jobs:** 1 (Backend Developer)
- **Total Applicants:** 1

---

## Sample Data Summary

### Users Created
- 1 Admin
- 5 Job Seekers (with complete profiles)
- 3 Employers (with company profiles)

### Jobs Posted
- 5 Active job postings across 3 companies
- Various positions: Full Stack, ML Engineer, Frontend, Backend, DevOps
- Salary ranges: $90,000 - $180,000

### Applications
- 6 Total applications
- Statuses: Pending, Reviewing, Shortlisted
- Match scores: 78% - 92%

### Saved Jobs
- 3 Saved jobs across different users

---

## Testing Workflows

### Job Seeker Workflow
1. Login as any job seeker (e.g., `john.doe@email.com` / `password123`)
2. View/edit profile
3. Browse jobs
4. View applications
5. Check saved jobs
6. View job recommendations

### Employer Workflow
1. Login as any employer (e.g., `hr@techcorp.com` / `employer123`)
2. View/edit company profile
3. View posted jobs
4. Check applicants for each job
5. Update application statuses
6. Post new jobs
7. View candidate recommendations

### Admin Workflow
1. Login as admin (`admin@jobmatchai.com` / `admin123`)
2. View all users
3. Moderate jobs
4. View platform analytics
5. Manage user accounts

---

## Notes

- All users have `isVerified: true` so you can login immediately
- Job seekers have complete profiles with skills, experience, and education
- Employers have complete company profiles
- Applications have realistic match scores (78-92%)
- Jobs are all in "active" status
- Application dates are staggered over the past week

---

## Quick Start

1. **Seed the database:**
   ```bash
   cd backend
   node seedData.js
   ```

2. **Start the backend:**
   ```bash
   npm start
   ```

3. **Start the frontend:**
   ```bash
   cd ../frontend
   npm start
   ```

4. **Login and explore!**
   - Try different user types to see different features
   - Job seekers can apply to jobs and see recommendations
   - Employers can manage applicants and post jobs
   - Admin can moderate and view analytics

---

## Resetting Data

To reset and reseed the database, simply run the seed script again:

```bash
cd backend
node seedData.js
```

This will clear all existing data and create fresh sample data.
