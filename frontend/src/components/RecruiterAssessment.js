import React from "react";
import "./RecruiterAssessment.css";

const RecruiterAssessment = () => {
  const assessments = [
    {
      candidate: "John Doe",
      skills: "React, Node.js, Python",
      score: 85,
      feedback: "Strong skills in full-stack development. Needs improvement in testing frameworks.",
    },
    {
      candidate: "Jane Smith",
      skills: "Java, Spring Boot, SQL",
      score: 90,
      feedback: "Excellent backend development skills. Highly recommended for complex projects.",
    },
    {
      candidate: "Mark Lee",
      skills: "UI/UX, HTML, CSS, JavaScript",
      score: 78,
      feedback: "Creative designer with good technical skills. Could improve in responsive design.",
    },
  ];

  return (
    <div className="recruiter-assessment">
      <h2>Candidate Assessments</h2>
      <div className="assessment-list">
        {assessments.map((assessment, index) => (
          <div className="assessment-card" key={index}>
            <h3>{assessment.candidate}</h3>
            <p><strong>Skills:</strong> {assessment.skills}</p>
            <p><strong>Score:</strong> {assessment.score}</p>
            <p><strong>Feedback:</strong> {assessment.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruiterAssessment;
