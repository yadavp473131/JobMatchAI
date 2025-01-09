// ResumeUploader.js
import React from "react";
import "./ResumeUploader.css"; // Import styles for the component

const ResumeUploader = () => {
  return (
    <div className="resume-uploader">
      {/* Upper Section for Dummy Resume Display */}
      <div className="upper-section">
        <h2>Dummy Resume</h2>
        <div className="resume-preview">
          <p>Name: John Doe</p>
          <p>Email: john.doe@example.com</p>
          <p>Phone: +1-234-567-8901</p>
          <p>Skills: React, Node.js, Python, JavaScript</p>
          <p>Experience: 3 years as a Full-Stack Developer</p>
        </div>
      </div>

      {/* Lower Section for Upload Functionality */}
      <div className="lower-section">
        <h3>Upload Your Resume</h3>
        <form>
          <input type="file" name="resume" accept=".pdf,.doc,.docx" />
          <button type="submit">Upload</button>
        </form>
      </div>
    </div>
  );
};

export default ResumeUploader;
