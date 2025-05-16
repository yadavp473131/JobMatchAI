import React, { useState } from "react";
import "./signup.css";

const SignUp = () => {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const response = await fetch("http://localhost:5000/signup", {
      const response = await fetch("https://jobmatchai.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_type: role, ...formData }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <label>Select Role:</label>
      <select onChange={(e) => setRole(e.target.value)}>
        <option value="">Select</option>
        <option value="jobseeker">Job Seeker</option>
        <option value="jobposter">Job Poster</option>
        <option value="admin">Admin</option>
      </select>

      {role && (
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="email" name="userName" placeholder="User Name" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input type="number" name="phone" placeholder="Phone Number" onChange={handleChange} required />
          <input type="text" name="address" placeholder="Adress" onChange={handleChange} required />
          
          {role === "jobseeker" && (
            <>
              <input type="text" name="skills" placeholder="Skills" onChange={handleChange} required />
              <input type="text" name="experience" placeholder="Experience (years)" onChange={handleChange} required />
            </>
          )}
          
          {role === "jobposter" && (
            <>
              <input type="text" name="company" placeholder="Company Name" onChange={handleChange} required />
              <input type="text" name="industry" placeholder="Industry" onChange={handleChange} required />
            </>
          )}
          
          {role === "admin" && (
            <>
              <input type="text" name="adminCode" placeholder="Admin Code" onChange={handleChange} required />
            </>
          )}
          
          <button type="submit">Register</button>
        </form>
      )}
    </div>
  );
};

export default SignUp;
