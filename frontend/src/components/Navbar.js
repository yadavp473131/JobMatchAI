import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "./Images/jobsearchlogo.png"; // Import logo image
import profileIcon from "./Images/profileicon.png"; // Import profile icon image

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Website Logo" onClick={() => navigate("/")} />
      </div>
      <div className="navbar-buttons">
        <Link to="/jobs" className="navbar-link">Job Search</Link>
        <Link to="/post" className="navbar-link">Post a Job</Link>
        <Link to="/upload" className="navbar-link">Upload Resume</Link>
        <Link to="/assessments" className="navbar-link">Recruiter Assessment</Link>
      </div>
      <div className="navbar-profile">
        <img
          src={profileIcon}
          alt="Profile Icon"
          onClick={() => navigate("/profile")}
        />
      </div>
    </nav>
  );
};

export default Navbar;
