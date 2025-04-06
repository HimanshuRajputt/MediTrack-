import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, role }) => {
  const { token, role: userRole } = useAuth();

  // If not logged in, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If role is defined and doesn't match, redirect to home
  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
