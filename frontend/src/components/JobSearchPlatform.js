import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";  // Import React Router
import JobPosting from "./JobPosting";
import Navbar from "./Navbar";
import LandingPage from "./LandingPage";
import JobSearch from "./JobSearch";
import ResumeUploader from "./ResumeUploader";
import RecruiterAssessment from "./RecruiterAssessment";
import Footer from "./Footer";
import Sponsors from "./Sponsor";
import './JobSearchPlatform.css';
import Profile from "./Profile";

const JobSearchPlatform = () => {
  return (
    <Router>
      <div id="root2">
        <Navbar />
        <div className="main-content">
          {/* Define Routes */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/jobs" element={<JobSearch />} />
            <Route path="/upload" element={<ResumeUploader />} />
            <Route path="/assessments" element={<RecruiterAssessment />} />
            <Route path="/post" element={<JobPosting />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          <Sponsors />
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default JobSearchPlatform;
