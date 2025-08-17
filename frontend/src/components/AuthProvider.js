import React, { useCallback, createContext, useContext, useState, useEffect } from "react";

// Create the context
const AuthContext = createContext();

// Export a hook for easier usage
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // const [user, setUser] = useState();
  const [sessionKey, setSessionKey] = useState(null);

// inside AuthProvider
const fetchUserFromSession = useCallback(async (key) => {
  
    try {
        // Example: Replace with actual API call like:
      // const response = await fetch(`http://localhost:5000/user/api/session/${key}`);
      const response = await fetch(`https://jobmatchai.onrender.com/user/api/session/${key}`);
      const userData = await response.json();
     
     
      setUser(userData);
      setSessionKey(key);
    } catch (error) {
      console.error("Session validation failed", error);
      logout();
    }
  }, []);

  // On first load, check sessionKey in localStorage
  useEffect(() => {
    const storedSessionKey = localStorage.getItem("sessionKey");
    // console.log(" stored session key "+storedSessionKey);
    // const storedSessionKey = "934bc9b7-ea65-4a88-998c-9c46d2a897d0";

    if (storedSessionKey) {
      // Ideally, you should validate the sessionKey with your backend here
      fetchUserFromSession(storedSessionKey);
    }
  
  }, [fetchUserFromSession]);

  

  // Login function
  const login = (userData, sessionKeyFromServer) => {
    setUser(userData);
    console.log(userData);
    setSessionKey(sessionKeyFromServer);
    // console.log(userData,sessionKeyFromServer);
    localStorage.setItem("sessionKey", sessionKeyFromServer);
    localStorage.setItem("name",userData.name);
    localStorage.setItem("userEmail",userData.email);
    localStorage.setItem("userRole",userData.user_type);
    localStorage.setItem("userName",userData.userName);
    localStorage.setItem("userPhone",userData.phone);
    localStorage.setItem("userAddress",userData.address);
    localStorage.setItem("userId",userData.Id);
    // console.log(" session key stored in localStorage ",localStorage.getItem("sessionKey"));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setSessionKey(null);
    localStorage.removeItem("sessionKey");
    // localStorage.removeItem("userName");
    // console.log(" logout called ",user);
  };

  const value = {
    user,
    sessionKey,
    isLoggedIn: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
