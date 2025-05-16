import React from "react";
import JobPosting from "./JobPosting";
import "./JobPosterDashboard.css";
import JobSeekerProfiles from './JobSeekerProfiles';


const JobPosterDashboard = () => (
  <div className="job-poster-dashboard">
    <h2>Job Poster Dashboard</h2>
    <div className="job-section">
      <JobPosting />
    </div>
    <div>
      <h1 className="text-2xl font-bold mb-4">Job Seeker Profiles</h1>
      <JobSeekerProfiles />
    </div>
    {/* Future components like <JobStatus />, <ApplicantsList />, etc. go here */}
  </div>
);

export default JobPosterDashboard;
