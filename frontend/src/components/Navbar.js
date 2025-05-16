import { Link, useNavigate } from "react-router-dom";
import logo from "./Images/jobsearchlogo.png"; // Import logo image
import profileIcon from "./Images/profileicon.png"; // Import profile icon image
import React from "react";
import "./Navbar.css"; // Import the styles

const Navbar = ({ role }) => {
  const navigate = useNavigate();
  const navConfig = {
    jobseeker: [
      { name: "Jobs", path: "/jobs" },
      { name: "Internships", path: "/internships" },
      { name: "Practice", path: "/practice" },
      { name: "Courses", path: "/courses" },
    ],
    jobposter: [
      { name: "Post a Job", path: "/post" },
      { name: "Job Seeker Profiles", path: "/seeker-profiles" },
      { name: "Dashboard", path: "/poster-dashboard" },
    ],
    admin: [
      { name: "Database Results", path: "/admin/database" },
      { name: "Activity Logs", path: "/admin/logs" },
      { name: "Manage Privileges", path: "/admin/privileges" },
    ],
  };

  const navItems = navConfig[role] || [];

  return (
    <nav className="navbar">
       <div className="navbar-logo">
         <img src={logo} alt="Website Logo" onClick={() => navigate("/")} />
       </div>
      <div className="navbar-brand">Career Portal</div>
      <ul className="navbar-menu">
        {navItems.map((item) => (
          <li className="navbar-item" key={item.name}>
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
             <div className="navbar-profile">
         <img
           src={profileIcon}           alt="Profile Icon"
           onClick={() => navigate("/profile")}
         />
       </div>
    </nav>
  );
};

export default Navbar;
