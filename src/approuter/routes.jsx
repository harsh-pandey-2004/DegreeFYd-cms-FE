import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { CollegeForm } from "../CRM";
import Login from "../components/login";
import Register from "../components/register";
import Navbar from "../components/Navbar";
import Dashboard from "../Dashboard";
import Sidebar from "../components/SIdebar";
import ListUser from "../ListUser";
import DashboardCourse from "../pages/DashboardCourse";
import CourseAdd from "../pages/CourseAdd";
import DashboardBlogs from "../DashboardBlogs";
import AddBlogs from "../AddBlogs";

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

const AppRouterWithLocation = () => {
  return (
    <BrowserRouter>
      <LocationAwareRouter />
    </BrowserRouter>
  );
};

const LocationAwareRouter = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [id, setId] = useState(false);
  const location = useLocation();
  const showSidebar =
    location.pathname === "/" ||
    location.pathname === "/add-course" ||
    (id &&
      (location.pathname === "/dashboard" ||
        location.pathname === "/list-courses"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
  };

  return (
    <div>
      <Navbar
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        setId={setId}
      />
      {showSidebar && <Sidebar />}
      <div className={showSidebar ? "ml-80" : ""}>
        <Routes>
          <Route path="/login" element={<Login />} />
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
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard setId={setId} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/list-courses"
            element={
              <ProtectedRoute>
                <DashboardCourse setId={setId} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/list-blogs"
            element={
              <ProtectedRoute>
                <DashboardBlogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-course"
            element={
              <ProtectedRoute>
                <CourseAdd setId={setId} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-blogs"
            element={
              <ProtectedRoute>
                <AddBlogs setId={setId} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <CollegeForm setId={setId} />
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
