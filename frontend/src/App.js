import React from 'react';
import theme from "./components/theme";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";  // Import React Router
import JobPosting from "./components/JobPosting";
import Navbar from "./components/Navbar";
// import LandingPage from "./LandingPage";
import JobSearch from "./components/JobSearch";
import ResumeUploader from "./components/ResumeUploader";
import RecruiterAssessment from "./components/RecruiterAssessment";
import Footer from "./components/Footer";
import LoginSignup from "./components/LoginSignup";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Sponsors from "./components/Sponsor";
import Profile from "./components/Profile";
import JobSeekerDashboard from "./components/JobSeekerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import JobPosterDashboard from "./components/JobPosterDashboard";
import AuthPrompt from "./components/AuthPrompt";
import { useAuth } from "./components/AuthProvider"; // assume you manage login state with a context
import HomePage from "./components/HomePage";
import JobSeekerProfiles from "./components/JobSeekerProfiles";


const App = () => {

  // var { user, isLoggedIn  } = useAuth(); // This should come from your auth logic
  const isLoggedIn = true;
  var userRole = "jobseeker";
  // if(user){
  //   userRole = user.user_type;
  // }
  return (
    <>
      <ThemeProvider theme={theme}>
       
          <Router>
            <Navbar role={userRole} />

            {/* Define Routes */}
            <Routes>
              <Route path="/" element={isLoggedIn ? <HomePage /> : <LoginSignup />} />
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
            <Footer />
          </Router>
      </ThemeProvider>


    </>
  );
};

export default App;
