import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "./AuthContext"; // assume you manage login state with a context
import { useAuth } from "./AuthProvider"; // assume you manage login state with a context

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login } = useAuth(); // <-- Get login function from AuthProvider

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const response = await fetch("http://localhost:5000/login", {
      const response = await fetch("https://jobmatchai.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      alert(data.message);

       
      if (response.ok) {
        // Assuming response includes a user object with a role
        const userRole = data.user_type;
      
        if (userRole === "jobseeker") {
          navigate("/jobseeker");
        } else if (userRole === "admin") {
          navigate("/admin");
        } else if (userRole === "jobposter") {
          navigate("/jobposter");
        } else {
          alert("Unknown role");
        }
      } else {
        alert(data.message || "Login failed");
      }

      const userData = {
        name: data.name,
        email: data.email,
        userName: data.userName,
        user_type: data.user_type,
        phone : data.phone,
        address : data.address,
        Id : data.Id,
        // Add any other fields you might need
      };

     
      const sessionKey = data.sessionKey; // Assume backend sends a sessionKey
        // console.log(userData, sessionKey);
        // Save session key and user into context and localStorage
        login(userData, sessionKey);

        
  
      } catch (error) {
        console.error("Login failed", error);
      }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
