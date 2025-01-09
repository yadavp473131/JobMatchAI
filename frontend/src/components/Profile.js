import React from "react";
import "./Profile.css";

const Profile = () => {
  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      <div className="profile-details">
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Email:</strong> john.doe@example.com</p>
        <p><strong>Phone:</strong> +1234567890</p>
        <p><strong>Address:</strong> 123 Main St, Anytown, USA</p>
      </div>
    </div>
  );
};

export default Profile;
