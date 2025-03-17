import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const [activeId, setActiveId] = useState("");
  const location = useLocation();

  // Define menu items based on the path
  const menuItems =
    location.pathname === "/add-course"
      ? [
          { id: "basicInfo", label: "Basic Info" },
          { id: "overview", label: "Overview" },
          { id: "eligibility", label: "Eligibility" },
          { id: "admissions", label: "Admissions" },
          { id: "fees", label: "Fees" },
          { id: "specializations", label: "Specializations" },
          { id: "syllabus", label: "Syllabus" },
          { id: "career", label: "Career" },
          { id: "faq", label: "Frequently Asked Questions" },
          { id: "benefits", label: "Benefits" },
        ]
      : [
          { id: "basic-info", label: "Basic Info" },
          { id: "overview", label: "Overview" },
          { id: "courses-and-fee", label: "Courses and Fee" },
          { id: "admission-process", label: "Admission Process" },
          { id: "approval-and-ranking", label: "Approval And Ranking" },
          { id: "accreditations", label: "Accreditations & Approvals" },
          { id: "placement-information", label: "Placement Information" },
          { id: "faculty-information", label: "Faculty Information" },
          { id: "faq", label: "Frequently Asked Questions" },
          { id: "exam-information", label: "Exam Information" },
          { id: "gallery", label: "Gallery" },
          { id: "sample-degree", label: "Sample Degree" },
          { id: "student-reviews", label: "Student Reviews" },
          { id: "exam-pattern", label: "Exam Pattern" },
        ];

  // Function to check which section is currently visible in the viewport
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Adding offset for better detection

      // Find the section that is currently in view
      for (const item of menuItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuItems]);

  const handleClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveId(id);
    }
  };

  return (
    <div className="fixed top-16 left-0 h-screen bg-white w-80 shadow-md p-4 overflow-y-auto pb-20">
      <h3 className="text-lg font-semibold mb-4 text-[#155DFC] border-b pb-2">
        {location.pathname === "/add-college" || location.pathname === "/dashboard"
          ? "College Information"
          : "Course Information"}
      </h3>
      <ul className="space-y-1">
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => handleClick(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center ${
                activeId === item.id
                  ? "bg-violet-100 text-[#155DFC] font-medium border-l-4 border-[#155DFC]"
                  : "hover:bg-green-50 hover:text-[#155DFC]"
              }`}
            >
              {activeId === item.id && (
                <span className="mr-2 text-[#155DFC]">•</span>
              )}
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
