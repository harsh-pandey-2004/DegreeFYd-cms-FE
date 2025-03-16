import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DegreeFydLogo  from '../assets/logo.png'
const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [showAddContentDropdown, setShowAddContentDropdown] = useState(false);
  const [showDashboardDropdown, setShowDashboardDropdown] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const toggleAddContentDropdown = () => {
    setShowAddContentDropdown(!showAddContentDropdown);
    if (showDashboardDropdown) setShowDashboardDropdown(false);
  };

  const toggleDashboardDropdown = () => {
    setShowDashboardDropdown(!showDashboardDropdown);
    if (showAddContentDropdown) setShowAddContentDropdown(false);
  };

  return (
    <nav className="bg-gray-50 fixed w-full z-50 text-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/list-user" className="text-black font-bold text-xl">
               <img src={DegreeFydLogo} alt="logo" className="h-14 w-full"></img>
              </Link>
            </div>

            {isAuthenticated && (
              <div className="ml-10 flex items-baseline space-x-4">
                {/* Dashboard Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleDashboardDropdown}
                    className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    Dashboard
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={
                          showDashboardDropdown
                            ? "M5 15l7-7 7 7"
                            : "M19 9l-7 7-7-7"
                        }
                      ></path>
                    </svg>
                  </button>
                  {showDashboardDropdown && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        to="/list-colleges"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDashboardDropdown(false)}
                      >
                        List Colleges
                      </Link>
                      <Link
                        to="/list-courses"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDashboardDropdown(false)}
                      >
                        List Courses
                      </Link>
                      <Link
                        to="/list-blogs"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDashboardDropdown(false)}
                      >
                        List Blogs
                      </Link>
                    </div>
                  )}
                </div>

                {/* Add Content Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleAddContentDropdown}
                    className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    Add Content
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={
                          showAddContentDropdown
                            ? "M5 15l7-7 7 7"
                            : "M19 9l-7 7-7-7"
                        }
                      ></path>
                    </svg>
                  </button>
                  {showAddContentDropdown && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        to="/"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowAddContentDropdown(false)}
                      >
                        Add Colleges
                      </Link>
                      <Link
                        to="/add-course"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowAddContentDropdown(false)}
                      >
                        Add Courses
                      </Link>
                      <Link
                        to="/add-blogs"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowAddContentDropdown(false)}
                      >
                        Add Blogs
                      </Link>
                    </div>
                  )}
                </div>

                {role === "admin" && (
                  <>
                    <Link
                      to="/register"
                      className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Register New User
                    </Link>
                    <Link
                      to="/list-user"
                      className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      List User
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-white bg-violet-600 hover:bg-violet-600 px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="text-white bg-violet-600 hover:bg-violet-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
