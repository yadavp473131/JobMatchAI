import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";  // Import React Router
import JobSearch from "./JobSearch";
// import ResumeUploader from "./ResumeUploader";


const JobSeekerDashboard = () => (
  <div>
    <h2>Job Seeker Dashboard</h2>
    {/* <JobSeekerNavbar/> */}
    <JobSearch />
    {/* <ResumeUploader /> */}
  </div>
);

export default JobSeekerDashboard;
