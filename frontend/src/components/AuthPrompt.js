// components/AuthPrompt.js
import React from "react";
import { Link } from "react-router-dom";

const AuthPrompt = () => (
  <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h2>Please <Link to="/">Sign In</Link> or <Link to="/signup">Sign Up</Link> to access assessments.</h2>
  </div>
);

export default AuthPrompt;
