import React from "react";
import { Link } from "react-router-dom";
import "./LoginSignup.css";

const LoginSignup = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Job Search Platform</h1>
      <p>Find your dream job or post a job for others.</p>
      <div className="home-buttons">
        <Link to="/login">
          <button className="home-btn">Login</button>
        </Link>
        <Link to="/signup">
          <button className="home-btn">Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default LoginSignup;
