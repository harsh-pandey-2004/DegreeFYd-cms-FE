import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { CollegeForm } from "../CRM";
import Login from "../components/login";
import Register from "../components/register";
import Navbar from "../components/Navbar";
import Dashboard from "../Dashboard";
import SIdebar from "../components/SIdebar";
import ListUser from "../ListUser";

// Protected route component to check authentication
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Main router component
const AppRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const isRootPath = location.pathname === "/";

  // Check for token on first render
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Logout function to be passed to Navbar
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
  };

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      {isRootPath && <SIdebar />}
      <div className={isRootPath ? "ml-80" : ""}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Admin-only route */}
          <Route
            path="/register"
            element={
              <ProtectedRoute adminOnly={true}>
                <Register />
              </ProtectedRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <CollegeForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
};

// Wrapper component to access location outside of Routes
const AppRouterWithLocation = () => {
  return (
    <BrowserRouter>
      <LocationAwareRouter />
    </BrowserRouter>
  );
};

// Inner component that has access to location
const LocationAwareRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const isRootPath = location.pathname === "/";

  // Check for token on first render
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Logout function to be passed to Navbar
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
  };

  return (
    <div>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      {isRootPath && <SIdebar />}
      <div className={isRootPath ? "ml-80" : ""}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Admin-only route */}
          <Route
            path="/register"
            element={
              <ProtectedRoute adminOnly={true}>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path="/list-user"
            element={
              <ProtectedRoute adminOnly={true}>
                <ListUser />
              </ProtectedRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <CollegeForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default AppRouterWithLocation;
