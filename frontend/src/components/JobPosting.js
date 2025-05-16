import React, { useState } from "react";
import "./JobPosting.css";

const JobPosting = () => {
  const jobCategories = ["Engineering", "Marketing", "Finance", "Design", "IT Support"];
  const jobTypes = ["Full-Time", "Part-Time", "Contract", "Internship"];
  const id = localStorage.getItem("userId");
  
  const [formData, setFormData] = useState({
    title: "",
    category: jobCategories[0],
    description: "",
    eligibility: "",
    requirements: "",
    salary: "",
    work_details: "",
    job_type: jobTypes[0],
    timing: "",
    job_posters_id:id,
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    try {
      const response = await fetch("https://jobmatchai.onrender.com/post-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Job posted successfully!");
        setFormData({
          title: "",
          category: jobCategories[0],
          description: "",
          eligibility: "",
          requirements: "",
          location: "",
          salary: "",
          work_details: "",
          job_type: jobTypes[0],
          timing: "",
          job_posters_id:"",
        });
      } else {
        alert("Error posting job. Please try again.");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="job-posting">
      <h2>Post a Job</h2>
      <form className="job-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <select name="category" value={formData.category} onChange={handleChange}>
          {jobCategories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        <textarea
          name="description"
          placeholder="Job Description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
        <textarea
          name="eligibility"
          placeholder="Eligibility Criteria"
          value={formData.eligibility}
          onChange={handleChange}
          required
        ></textarea>
        <textarea
          name="requirements"
          placeholder="Job Requirements"
          value={formData.requirements}
          onChange={handleChange}
          required
        ></textarea>
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          required
        />
        <textarea
          name="work_details"
          placeholder="Work Details"
          value={formData.work_details}
          onChange={handleChange}
          required
        ></textarea>
        <select name="job_type" value={formData.job_type} onChange={handleChange}>
          {jobTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="timing"
          placeholder="Work Timing"
          value={formData.timing}
          onChange={handleChange}
          required
        />
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
};

export default JobPosting;
