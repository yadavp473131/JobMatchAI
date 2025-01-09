import React, { useEffect, useState } from "react";
import "./JobSearch.css";

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // Fetch jobs from the backend
  useEffect(() => {
    fetch("http://localhost:5000/jobs")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        return response.json();
      })
      .then((data) => setJobs(data))
      .catch((error) => console.error("Error fetching jobs:", error));
  }, []);

  return (
    <div className="job-search-container">
      <h1>Available Jobs</h1>
      <div className="job-list">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job._id}
              className="job-card"
              onClick={() => setSelectedJob(job)}
            >
              <h2>{job.title}</h2>
              <p><strong>Category:</strong> {job.category}</p>
              <p><strong>Type:</strong> {job.job_type}</p>
            </div>
          ))
        ) : (
          <p>No jobs available</p>
        )}
      </div>

      {selectedJob && (
        <div className="job-details">
          <h2>{selectedJob.title}</h2>
          <p><strong>Description:</strong> {selectedJob.description}</p>
          <p><strong>Eligibility:</strong> {selectedJob.eligibility}</p>
          <p><strong>Requirements:</strong> {selectedJob.requirements}</p>
          <p><strong>Salary:</strong> {selectedJob.salary}</p>
          <p><strong>Work Details:</strong> {selectedJob.work_details}</p>
          <p><strong>Job Type:</strong> {selectedJob.job_type}</p>
          <p><strong>Timing:</strong> {selectedJob.timing}</p>
          <button onClick={() => alert("Applied!")}>Apply Now</button>
        </div>
      )}
    </div>
  );
};

export default JobSearch;
