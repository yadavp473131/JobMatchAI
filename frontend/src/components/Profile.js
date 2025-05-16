import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { useAuth } from "./AuthProvider";

const Profile = () => {
  // const { isLoggedIn, logout } = useAuth();
  const {  logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser2] = useState(null);

  useEffect(() => {
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("userEmail");
    const phone = localStorage.getItem("userPhone");
    const address = localStorage.getItem("userAddress");
    const userRole = localStorage.getItem("userRole");
    const userName = localStorage.getItem("userName");
    

    if (name && email) {
      setUser2({ name, email, phone, address, userRole, userName });
    }
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("name");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userAddress");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    setUser2(null); // This will trigger re-render and show the sign-in block
    navigate("/login"); // Redirect can happen here or based on state
  };

  const handleSignIn = () => navigate("/login");
  const handleSignUp = () => navigate("/signup");

  if (!user) {
    return (
      <div className="profile-container">
        <h1>Welcome!</h1>
        <p>Please sign in or sign up to view your profile.</p>
        <div className="auth-buttons">
          <button onClick={handleSignIn}>Sign In</button>
          <button onClick={handleSignUp}>Sign Up</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      <div className="profile-details">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
        <p><strong>Address:</strong> {user.address || "N/A"}</p>
        <p><strong>User Role:</strong> {user.userRole || "N/A"}</p>
        <p><strong>User Name:</strong> {user.userName || "N/A"}</p>
      </div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default Profile;
