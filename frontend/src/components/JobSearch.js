import React, { useEffect, useState } from "react";
import "./JobSearch.css";
import { useNavigate } from "react-router-dom";

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  // const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState({
      _id: "1",
      title: "Frontend Developer",
      category: "Software",
      location: "Bengaluru",
      job_type: "Full-Time",
      description: "Build and maintain UI components using React.",
      eligibility: "B.Tech in Computer Science or related field.",
      requirements: "Proficiency in React, CSS, JavaScript.",
      salary: "₹6-10 LPA",
      work_details: "Work from office",
      timing: "Day Shift",
    });
  
  const [filters, setFilters] = useState({
    location: "",
    category: "",
    jobType: "",
  });

  const navigate = useNavigate();

  const defaultJobs = [
    {
      _id: "1",
      title: "Frontend Developer",
      category: "Software",
      location: "Bengaluru",
      job_type: "Full-Time",
      description: "Build and maintain UI components using React.",
      eligibility: "B.Tech in Computer Science or related field.",
      requirements: "Proficiency in React, CSS, JavaScript.",
      salary: "₹6-10 LPA",
      work_details: "Work from office",
      timing: "Day Shift",
    },
    {
      _id: "2",
      title: "Backend Developer",
      category: "Software",
      location: "Hyderabad",
      job_type: "Full-Time",
      description: "Develop scalable APIs with Node.js and Express.",
      eligibility: "Strong knowledge of backend systems.",
      requirements: "Node.js, MongoDB, REST APIs.",
      salary: "₹8-12 LPA",
      work_details: "Hybrid",
      timing: "Day Shift",
    },
    {
      _id: "3",
      title: "Data Analyst",
      category: "Analytics",
      location: "Remote",
      job_type: "Part-Time",
      description: "Analyze datasets and prepare reports.",
      eligibility: "Graduate with analytical background.",
      requirements: "SQL, Excel, Python (preferred).",
      salary: "₹4-6 LPA",
      work_details: "Remote",
      timing: "Flexible",
    },
    {
      _id: "4",
      title: "HR Manager",
      category: "Human Resources",
      location: "Delhi",
      job_type: "Full-Time",
      description: "Manage recruitment and employee relations.",
      eligibility: "MBA in HR or related field.",
      requirements: "Strong communication and organizational skills.",
      salary: "₹7-9 LPA",
      work_details: "Work from office",
      timing: "Day Shift",
      
    },
  ];

  const handleApply = async (jobId, applicantId) => {
  try {
    // const response = await fetch('http://localhost:5000/apply', {
    const response = await fetch('https://jobmatchai.onrender.com/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${yourAuthToken}` // if you're using JWT
      },
      body: JSON.stringify({ jobId, applicantId }),
    });

    const result = await response.json();
    if (response.ok) {
      alert('Successfully applied!');
    } else {
      alert(`Failed to apply: ${result.message}`);
    }
  } catch (error) {
    console.error('Error applying:', error);
    alert('Something went wrong.');
  }
   navigate("/upload-resume");
};

  

  
  // Fetch internal jobs
  // useEffect(() => {
  //   fetch("https://jobmatchai.onrender.com/jobs")
  //     .then((response) => {
  //       if (!response.ok) throw new Error("Failed to fetch jobs");
  //       return response.json();
  //     })
  //     .then((data) => {
  //       setJobs(data);
  //       setFilteredJobs(data);
  //     })
  //     .catch((error) => console.error("Error fetching jobs:", error));
  // }, []);

  // Apply filters
  // useEffect(() => {
  //   const { location, category, jobType } = filters;
  
  //   const matchFilter = (job) => {
  //     const matchesLocation = location ? job.location?.toLowerCase().includes(location.toLowerCase()) : true;
  //     const matchesCategory = category ? job.category?.toLowerCase().includes(category.toLowerCase()) : true;
  //     const matchesJobType = jobType ? job.job_type?.toLowerCase().includes(jobType.toLowerCase()) : true;
  //     return matchesLocation && matchesCategory && matchesJobType;
  //   };

  //   const filtered = jobs.filter(matchFilter);
  //   setFilteredJobs(filtered);

  //   // Auto-clear selected job if it no longer matches
  //   if (selectedJob && !filtered.find(j => j._id === selectedJob._id)) {
  //     setSelectedJob(null);
  //   }
  // }, [filters, jobs, selectedJob]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="job-search-container">
      <h1>Job Listings</h1>

      {/* Filter Section */}
      <div className="filters">
        <input
          type="text"
          name="location"
          placeholder="Filter by Location"
          value={filters.location}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Filter by Category"
          value={filters.category}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="jobType"
          placeholder="Filter by Job Type"
          value={filters.jobType}
          onChange={handleFilterChange}
        />
      </div>

      {/* Two-column layout */}
      <div className="jobs-section">
        {/* Left Column: Job List */}
        <div className="job-list-column">
          <h2>Available Jobs</h2>
          {/* {filteredJobs.length > 0 ? ( */}
          {defaultJobs.length > 0 ? (
            // filteredJobs.map((job) => (
            defaultJobs.map((job) => (
              <div
                key={job._id}
                className={`job-card ${selectedJob?._id === job._id ? "selected" : ""}`}
                onClick={() => setSelectedJob(job)}
              >
                <h3>{job.title}</h3>
                <p><strong>Category:</strong> {job.category}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Type:</strong> {job.job_type}</p>
              </div>
            ))
          ) : (
            <p>No jobs found</p>
          )}
        </div>

        {/* Right Column: Job Details */}
        <div className="job-list-column job-details-column">
          <h2>Job Details</h2>
          {selectedJob ? (
            <div className="job-details">
              <h2>{selectedJob.title}</h2>
              {selectedJob.description && <p><strong>Description:</strong> {selectedJob.description}</p>}
              {selectedJob.eligibility && <p><strong>Eligibility:</strong> {selectedJob.eligibility}</p>}
              {selectedJob.requirements && <p><strong>Requirements:</strong> {selectedJob.requirements}</p>}
              {selectedJob.salary && <p><strong>Salary:</strong> {selectedJob.salary}</p>}
              {selectedJob.work_details && <p><strong>Work Details:</strong> {selectedJob.work_details}</p>}
              {selectedJob.job_type && <p><strong>Job Type:</strong> {selectedJob.job_type}</p>}
              {selectedJob.timing && <p><strong>Timing:</strong> {selectedJob.timing}</p>}
              <button onClick={() => handleApply(selectedJob._id, localStorage.getItem("userId"))}>Apply Now</button>
            </div>
          ) : (
            <p>Select a job to see its details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
