import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";  // Import React Router
import JobPosting from "./JobPosting";
import Navbar from "./Navbar";
// import LandingPage from "./LandingPage";
import JobSearch from "./JobSearch";
import ResumeUploader from "./ResumeUploader";
import RecruiterAssessment from "./RecruiterAssessment";
import Footer from "./Footer";
import Home from "./Home";
import Login from "./Login";
import SignUp from "./SignUp";
import Sponsors from "./Sponsor";
import './JobSearchPlatform.css';
import Profile from "./Profile";
import JobSeekerDashboard from "./JobSeekerDashboard";
import AdminDashboard from "./AdminDashboard";
import JobPosterDashboard from "./JobPosterDashboard";
import AuthPrompt from "./AuthPrompt";
import { useAuth } from "./AuthProvider"; // assume you manage login state with a context
import HomePage from "./HomePage";
import JobSeekerProfiles from "./JobSeekerProfiles";

    
const JobSearchPlatform = () => {
  
  var { user, isLoggedIn  } = useAuth(); // This should come from your auth logic
  
  var userRole = "jobseeker";
  if(user){

    userRole = user.user_type;
  }
  
  //  console.log(localStorage.getItem("sessionKey"));
  return (
    <Router>
      <div id="root2">
        {/* <Navbar role={user_type}/> */}
        <Navbar role={userRole}/>
        <div className="main-content">
          {/* Define Routes */}
          <Routes>
            <Route path="/" element={isLoggedIn ? <HomePage /> :<Home />} />
          
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/seeker-profiles" element={<JobSeekerProfiles />} />
            <Route path="/jobs" element={isLoggedIn ? <JobSearch /> : <AuthPrompt />} />
            <Route path="/upload-resume" element={isLoggedIn ? <ResumeUploader /> : <AuthPrompt />} />
            {/* <Route path="/assessments" element={<RecruiterAssessment />} /> */}
            <Route path="/assessments" element={isLoggedIn ? <RecruiterAssessment /> : <AuthPrompt />} />
            <Route path="/post" element={isLoggedIn ? <JobPosting /> : <AuthPrompt />} />
            <Route path="/profile" element={<Profile />} />
            {/* <Route path="/" element={<Login />} /> */}
            <Route path="/jobseeker" element={<JobSeekerDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/jobposter" element={<JobPosterDashboard />} />
          </Routes>
          <Sponsors />
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default JobSearchPlatform;
