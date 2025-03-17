import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DegreeFydLogo from "../assets/logo.png";

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [showAddContentDropdown, setShowAddContentDropdown] = useState(false);
  const [showDashboardDropdown, setShowDashboardDropdown] = useState(false);

  const handleLogout = () => {
    onLogout();
    handleNavigation("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setTimeout(() => {
      window.location.reload();
    }, 100); // Small delay to allow navigation before reloading
  };

  return (
    <nav className="bg-gray-50 fixed w-full z-50 text-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                src={DegreeFydLogo}
                alt="logo"
                className="h-14 w-full cursor-pointer"
                onClick={() => handleNavigation("/list-user")}
              />
            </div>

            {isAuthenticated && (
              <div className="ml-10 flex items-baseline space-x-4">
                {/* Dashboard Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowDashboardDropdown(!showDashboardDropdown)}
                    className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    Dashboard
                  </button>
                  {showDashboardDropdown && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleNavigation("/list-colleges")}
                      >
                        List Colleges
                      </button>
                      <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleNavigation("/list-courses")}
                      >
                        List Courses
                      </button>
                      <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleNavigation("/list-blogs")}
                      >
                        List Blogs
                      </button>
                    </div>
                  )}
                </div>

                {/* Add Content Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowAddContentDropdown(!showAddContentDropdown)}
                    className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    Add Content
                  </button>
                  {showAddContentDropdown && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleNavigation("/")}
                      >
                        Add Colleges
                      </button>
                      <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleNavigation("/add-course")}
                      >
                        Add Courses
                      </button>
                      <button
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => handleNavigation("/add-blogs")}
                      >
                        Add Blogs
                      </button>
                    </div>
                  )}
                </div>

                {role === "admin" && (
                  <>
                    <button
                      className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                      onClick={() => handleNavigation("/register")}
                    >
                      Register New User
                    </button>
                    <button
                      className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                      onClick={() => handleNavigation("/list-user")}
                    >
                      List User
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-white bg-[#155DFC] hover:bg-[#155DFC] px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            ) : (
              <button
                className="text-white bg-[#155DFC] hover:bg-[#155DFC] px-3 py-2 rounded-md text-sm font-medium"
                onClick={() => handleNavigation("/login")}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
