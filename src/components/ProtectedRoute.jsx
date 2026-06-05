import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // If no token or user, redirect to login
  if (!token || !user) {
    return <Navigate to="/logIn" replace />;
  }

  // Parse user data to check profile completion
  try {
    const userData = JSON.parse(user);
    
    // If user is not verified, redirect to OTP
    if (userData.isVerified === false) {
      return <Navigate to="/logIn/forgetpass/otp" replace />;
    }
    
    // If profile is not completed, redirect to complete profile
    if (userData.isCompletedProfile === false) {
      return <Navigate to="/compeleteprofile" replace />;
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
    return <Navigate to="/logIn" replace />;
  }

  // User is authenticated and verified, render the protected component
  return children;
};

export default ProtectedRoute;
