import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DegreeFydLogo from "../assets/logo.png";

const Navbar = ({ isAuthenticated, onLogout, setId }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [activeDropdown, setActiveDropdown] = useState(null); // Track active dropdown

  const addContentRef = useRef(null);
  const dashboardRef = useRef(null);

  const handleLogout = () => {
    onLogout();
    handleNavigation("/login");
  };

  const handleNavigation = (path) => {
    if (window.location.pathname === path) {
      window.location.reload(); // Reload if already on the same route
    } else {
      navigate(path);
    }
    setActiveDropdown(null); // Close dropdowns
    setId(false);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown((prev) => (prev === dropdown ? null : dropdown)); // Toggle dropdown
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        addContentRef.current &&
        !addContentRef.current.contains(event.target) &&
        dashboardRef.current &&
        !dashboardRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
                <div className="relative" ref={dashboardRef}>
                  <button
                    onClick={() => toggleDropdown("dashboard")}
                    className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    Dashboard ▼
                  </button>
                  {activeDropdown === "dashboard" && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      {[
                        { label: "List Colleges", path: "/list-colleges" },
                        { label: "List Courses", path: "/list-courses" },
                        { label: "List Blogs", path: "/list-blogs" },
                      ].map((item) => (
                        <button
                          key={item.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={() => handleNavigation(item.path)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Content Dropdown */}
                <div className="relative" ref={addContentRef}>
                  <button
                    onClick={() => toggleDropdown("addContent")}
                    className="text-black hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    Add Content ▼
                  </button>
                  {activeDropdown === "addContent" && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      {[
                        { label: "Add Colleges", path: "/" },
                        { label: "Add Courses", path: "/add-course" },
                        { label: "Add Blogs", path: "/add-blogs" },
                      ].map((item) => (
                        <button
                          key={item.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={() => handleNavigation(item.path)}
                        >
                          {item.label}
                        </button>
                      ))}
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
