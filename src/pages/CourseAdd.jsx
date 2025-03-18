import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

const CourseForm = ({ userIdprop }) => {
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    createdBy: localStorage.getItem("userId"),
    courseTitle: "",
    shortDescription: "",
    keyHighlights: "",
    duration: "",
    mode: "Online",
    eligibility: "",
    universities: 0,
    overview: "",
    whyCourse: "",
    eligibilityDetails: "",
    admissionProcess: "",
    averageCourseFee: 0,
    scholarship: false,
    loanAssistance: false,
    specializations: "",
    specializationDetails: [],
    syllabus: "",
    semester: [],
    careerScope: "",
    topRecruiters: "",
    topCollegeOffering: "",
    faq: [],
    benefitsOfOnlineMBA: "",
    image: "",
  });
  const formStorageKey = userIdprop
    ? `courseForm_${userIdprop}`
    : "courseForm_draft";

  // Function to clear saved form data
  const clearSavedFormData = () => {
    localStorage.removeItem(formStorageKey);
  };

  useEffect(() => {
    // Only load from localStorage if not in edit mode (no userIdprop)
    if (!userIdprop) {
      const savedFormData = localStorage.getItem(formStorageKey);
      if (savedFormData) {
        try {
          const parsedData = JSON.parse(savedFormData);
          setCourse(parsedData);
          console.log("Form data loaded from localStorage");
        } catch (e) {
          console.error("Error parsing saved form data:", e);
        }
      }
    }
  }, [formStorageKey, userIdprop]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    // Don't save if it's the initial empty state or there's nothing meaningful entered
    // Also don't save if in edit mode (userIdprop exists)
    if (
      !userIdprop &&
      course &&
      (course.courseTitle || course.admissionProcess || course.overview)
    ) {
      try {
        localStorage.setItem(formStorageKey, JSON.stringify(course));
        console.log("Form data saved to localStorage");
      } catch (e) {
        console.error("Error saving form data:", e);
      }
    }
  }, [course, formStorageKey, userIdprop]);

  // Modify your useEffect for API fetching
  useEffect(() => {
    const fetchEditInfo = async () => {
      if (!userIdprop) return; // Only fetch if we have a userIdprop

      try {
        console.log("Fetching course data for ID:", userIdprop);
        const response = await axios.get(
          `https://degreefydcmsbe.onrender.com/api/courses1/${userIdprop}`
        );

        if (response.data && response.data.data) {
          console.log("Course data fetched successfully:", response.data.data);

          // Ensure all necessary fields exist in the response data
          const fetchedData = response.data.data;
          const processedData = {
            ...course, // Keep defaults for any missing fields
            ...fetchedData, // Override with fetched values
            // Convert empty arrays if they are null or undefined
            specializationDetails: fetchedData.specializationDetails || [],
            semester: fetchedData.semester || [],
            faq: fetchedData.faq || [],
          };

          setCourse(processedData);
        } else {
          console.error("Invalid response format:", response);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        // Consider showing an error message to the user here
      }
    };

    fetchEditInfo();
  }, [userIdprop]); // Only depend on userIdprop

  // Create refs for each section for scrolling
  const sectionRefs = {
    basicInfo: useRef(),
    overview: useRef(),
    eligibility: useRef(),
    admissions: useRef(),
    fees: useRef(),
    specializations: useRef(),
    syllabus: useRef(),
    career: useRef(),
    faq: useRef(),
    benefits: useRef(),
  };

  // Function to scroll to a specific section
  const scrollToSection = (sectionId) => {
    sectionRefs[sectionId]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourse({
      ...course,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle Quill editor changes
  const handleQuillChange = (value, name) => {
    setCourse({
      ...course,
      [name]: value,
    });
  };

  // Handle specialization details changes
  const handleSpecializationChange = (index, field, value) => {
    const updatedSpecs = [...course.specializationDetails];
    updatedSpecs[index] = {
      ...updatedSpecs[index],
      [field]: value,
    };
    setCourse({
      ...course,
      specializationDetails: updatedSpecs,
    });
  };

  // Add new specialization
  const addSpecialization = () => {
    setCourse({
      ...course,
      specializationDetails: [
        ...course.specializationDetails,
        { title: "", description: "" },
      ],
    });
  };

  // Remove specialization
  const removeSpecialization = (index) => {
    const updatedSpecs = [...course.specializationDetails];
    updatedSpecs.splice(index, 1);
    setCourse({
      ...course,
      specializationDetails: updatedSpecs,
    });
  };

  // Handle FAQ changes
  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...course.faq];
    updatedFaqs[index] = {
      ...updatedFaqs[index],
      [field]: value,
    };
    setCourse({
      ...course,
      faq: updatedFaqs,
    });
  };

  // Add new FAQ
  const addFaq = () => {
    setCourse({
      ...course,
      faq: [...course.faq, { question: "", answer: "" }],
    });
  };

  // Remove FAQ
  const removeFaq = (index) => {
    const updatedFaqs = [...course.faq];
    updatedFaqs.splice(index, 1);
    setCourse({
      ...course,
      faq: updatedFaqs,
    });
  };

  // Add semester
  const addSemester = () => {
    setCourse({
      ...course,
      semester: [...course.semester, ""],
    });
  };

  // Handle semester change
  const handleSemesterChange = (index, value) => {
    const updatedSemesters = [...course.semester];
    updatedSemesters[index] = value;
    setCourse({
      ...course,
      semester: updatedSemesters,
    });
  };

  // Remove semester
  const removeSemester = (index) => {
    const updatedSemesters = [...course.semester];
    updatedSemesters.splice(index, 1);
    setCourse({
      ...course,
      semester: updatedSemesters,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (course) {
      try {
        const userId = localStorage.getItem("userId");
        const payload = {
          ...course,
          createdBy: userId,
        };

        if (userIdprop) {
          console.log("Updating course with data:", payload);
          const response = await axios.put(
            `https://degreefydcmsbe.onrender.com/api/courses1/${userIdprop}`,
            payload
          );
          console.log("Update response:", response);
          alert("Your Approval Request has been sent for course");
          navigate("/list-courses");
        } else {
          console.log("Creating new course with data:", payload);
          const response = await axios.post(
            "https://degreefydcmsbe.onrender.com/api/courses1",
            payload
          );
          console.log("Create response:", response);
          alert("Your Approval Request has been sent for course");
          clearSavedFormData();
          navigate("/list-courses");
        }
      } catch (error) {
        console.error("Error submitting course:", error);
        alert(
          `Error: ${error.response?.data?.message || "Failed to submit course"}`
        );
      }
    }
  };

  // Quill editor modules and formats
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
    "image",
  ];

  // Debug course state
  useEffect(() => {
    if (course.courseTitle) {
      console.log("Course state updated:", course);
    }
  }, [course]);
  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 pb-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {userIdprop ? "Edit New Course" : "Add New Course"}
        </h1>
        {console.log(course, "course-testing")}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div
            id="basicInfo"
            // ref={sectionRefs.basicInfo}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-3xl font-bold mb-6 text-[#155DFC] border-b pb-2">
              Basic Information
            </h3>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="courseTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Course Title
                </label>
                <input
                  type="text"
                  name="courseTitle"
                  id="courseTitle"
                  placeholder="Enter course title"
                  value={course.courseTitle || ""}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label
                  htmlFor="shortDescription"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Short Description
                </label>
                <div className="mb-16">
                  <ReactQuill
                    theme="snow"
                    value={course?.shortDescription}
                    onChange={(content) =>
                      handleQuillChange(content, "shortDescription")
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Enter a brief description of the course"
                    className="min-h-[150px] w-full"
                    style={{
                      minHeight: "150px",
                      maxHeight: "none",
                      overflow: "hidden",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="keyHighlights"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Key Highlights
                </label>
                <div className="mb-16">
                  <ReactQuill
                    theme="snow"
                    value={course.keyHighlights}
                    onChange={(content) =>
                      handleQuillChange(content, "keyHighlights")
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Enter key highlights of the course"
                    className="min-h-[150px] w-full"
                    style={{
                      minHeight: "150px",
                      maxHeight: "none",
                      overflow: "hidden",
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    id="duration"
                    placeholder="e.g., 2 years, 4 semesters"
                    value={course.duration}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="mode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mode
                  </label>
                  <select
                    name="mode"
                    id="mode"
                    value={course.mode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="Online">Online</option>
                    <option value="Regular">Regular</option>
                    <option value="Distance">Distance</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="universities"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Number of Universities
                  </label>
                  <input
                    type="number"
                    name="universities"
                    id="universities"
                    placeholder="Enter number of universities offering this course"
                    value={course.universities}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Course Image URL
                  </label>
                  <input
                    type="text"
                    name="image"
                    id="image"
                    placeholder="Enter image URL for the course"
                    value={course.image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Overview Section */}
          <div
            id="overview"
            ref={sectionRefs.overview}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-3xl font-bold mb-6 text-[#155DFC] border-b pb-2">
              Course Overview
            </h3>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="overview"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Overview
                </label>
                <div className="mb-16">
                  <ReactQuill
                    theme="snow"
                    value={course.overview}
                    onChange={(content) =>
                      handleQuillChange(content, "overview")
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Provide a detailed overview of the course"
                    className="min-h-[150px] w-full"
                    style={{
                      minHeight: "150px",
                      maxHeight: "none",
                      overflow: "hidden",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="whyCourse"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Why This Course
                </label>
                <div className="mb-16">
                  <ReactQuill
                    theme="snow"
                    value={course.whyCourse}
                    onChange={(content) =>
                      handleQuillChange(content, "whyCourse")
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Explain why students should choose this course"
                    className="min-h-[150px] w-full"
                    style={{
                      minHeight: "150px",
                      maxHeight: "none",
                      overflow: "hidden",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Eligibility Section */}
          <div
            id="eligibility"
            ref={sectionRefs.eligibility}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-3xl font-bold mb-6 text-[#155DFC] border-b pb-2">
              Eligibility
            </h3>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="eligibility"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Basic Eligibility
                </label>
                <input
                  type="text"
                  name="eligibility"
                  id="eligibility"
                  placeholder="e.g., Bachelor's degree with 50% marks"
                  value={course.eligibility}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label
                  htmlFor="eligibilityDetails"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Eligibility Details
                </label>
                <div className="mb-16">
                  <ReactQuill
                    theme="snow"
                    value={course.eligibilityDetails}
                    onChange={(content) =>
                      handleQuillChange(content, "eligibilityDetails")
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Provide detailed eligibility criteria"
                    className="min-h-[150px] w-full"
                    style={{
                      minHeight: "150px",
                      maxHeight: "none",
                      overflow: "hidden",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Admission Process Section */}
          <div
            id="admissions"
            ref={sectionRefs.admissions}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-3xl font-bold mb-6 text-[#155DFC] border-b pb-2">
              Admission Process
            </h3>

            <div>
              <label
                htmlFor="admissionProcess"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Admission Process
              </label>
              <div className="mb-16">
                <ReactQuill
                  theme="snow"
                  value={course.admissionProcess}
                  onChange={(content) =>
                    handleQuillChange(content, "admissionProcess")
                  }
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Describe the admission process in detail"
                  className="min-h-[150px] w-full"
                  style={{
                    minHeight: "150px",
                    maxHeight: "none",
                    overflow: "hidden",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Fees and Financial Section */}
          <div
            id="fees"
            ref={sectionRefs.fees}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-3xl font-bold mb-6 text-[#155DFC] border-b pb-2">
              Fees and Financial Assistance
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="averageCourseFee"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Average Course Fee
                </label>
                <input
                  type="number"
                  name="averageCourseFee"
                  id="averageCourseFee"
                  placeholder="Enter average course fee in INR"
                  value={course.averageCourseFee}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="flex items-center space-x-8 mt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="scholarship"
                    id="scholarship"
                    checked={course.scholarship}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#155DFC] focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="scholarship"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Scholarship Available
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="loanAssistance"
                    id="loanAssistance"
                    checked={course.loanAssistance}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#155DFC] focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="loanAssistance"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Loan Assistance
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Specializations Section */}
          <div
            id="specializations"
            ref={sectionRefs.specializations}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-3xl font-bold mb-6 text-[#155DFC] border-b pb-2">
              Specializations
            </h3>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="specializations"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Specializations Overview
                </label>
                <div className="mb-16">
                  <ReactQuill
                    theme="snow"
                    value={course.specializations}
                    onChange={(content) =>
                      handleQuillChange(content, "specializations")
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Provide an overview of available specializations"
                    className="min-h-[150px] w-full"
                    style={{
                      minHeight: "150px",
                      maxHeight: "none",
                      overflow: "hidden",
                    }}
                  />
                </div>
              </div>

              {course?.specializationDetails?.map((spec, index) => (
                <div
                  key={`spec-${index}`}
                  className="border border-gray-200 rounded-lg p-4 mb-4"
                >
                  <h5 className="font-medium text-gray-700 mb-3">
                    Specialization {index + 1}
                  </h5>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={spec.title || ""}
                      placeholder="Enter specialization title"
                      onChange={(e) =>
                        handleSpecializationChange(
                          index,
                          "title",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="mb-16">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <ReactQuill
                      theme="snow"
                      value={spec.description || ""}
                      onChange={(content) =>
                        handleSpecializationChange(
                          index,
                          "description",
                          content
                        )
                      }
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Describe this specialization"
                      className="min-h-[150px] w-full"
                      style={{
                        minHeight: "150px",
                        maxHeight: "none",
                        overflow: "hidden",
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSpecialization(index)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors duration-200"
                  >
                    Remove Specialization
                  </button>
                </div>
              ))}

              <div className="mt-4">
                <button
                  type="button"
                  onClick={addSpecialization}
                  className="px-4 py-2 bg-[#155DFC] text-white rounded-md hover:bg-[#155DFC] transition-colors duration-200 flex items-center"
                >
                  <span className="mr-1">+</span> Add Specialization
                </button>
              </div>
            </div>
          </div>

          {/* Syllabus Section */}
          <div
            id="syllabus"
            ref={sectionRefs.syllabus}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-3xl font-bold mb-6 text-[#155DFC] border-b pb-2">
              Syllabus
            </h3>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="syllabus"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Syllabus Overview
                </label>
                <div className="mb-16">
                  <ReactQuill
                    theme="snow"
                    value={course.syllabus}
                    onChange={(content) =>
                      handleQuillChange(content, "syllabus")
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Provide an overview of the course syllabus"
                    className="min-h-[150px] w-full"
                    style={{
                      minHeight: "150px",
                      maxHeight: "none",
                      overflow: "hidden",
                    }}
                  />
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-700 mb-3">Semesters</h5>
                {course?.semester?.map((sem, index) => (
                  <div key={`sem-${index}`} className="flex mb-2">
                    <input
                      type="text"
                      value={sem}
                      onChange={(e) =>
                        handleSemesterChange(index, e.target.value)
                      }
                      placeholder={`Enter subjects for Semester ${index + 1}`}
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mr-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeSemester(index)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors duration-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSemester}
                  className="mt-4 px-4 py-2 bg-[#155DFC] text-white rounded-md hover:bg-[#155DFC] transition-colors duration-200 flex items-center"
                >
                  <span className="mr-1">+</span> Add Semester
                </button>
              </div>
            </div>
          </div>

          {/* Career Section */}
          <div
            id="career"
            ref={sectionRefs.career}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-3xl font-bold mb-6 text-[#155DFC] border-b pb-2">
              Career Opportunities
            </h3>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="careerScope"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Career Scope
                </label>
                <div className="mb-16">
                  <ReactQuill
                    theme="snow"
                    value={course.careerScope}
                    onChange={(content) =>
                      handleQuillChange(content, "careerScope")
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Describe career opportunities after this course"
                    className="min-h-[150px] w-full"
                    style={{
                      minHeight: "150px",
                      maxHeight: "none",
                      overflow: "hidden",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="topRecruiters"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Top Recruiters
                </label>
                <div className="mb-16">
                  <ReactQuill
                    theme="snow"
                    value={course.topRecruiters}
                    onChange={(content) =>
                      handleQuillChange(content, "topRecruiters")
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="List the top companies that recruit graduates"
                    className="min-h-[150px] w-full"
                    style={{
                      minHeight: "150px",
                      maxHeight: "none",
                      overflow: "hidden",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="topCollegeOffering"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Top Colleges Offering This Course
                </label>
                <div className="mb-16">
                  <ReactQuill
                    theme="snow"
                    value={course.topCollegeOffering}
                    onChange={(content) =>
                      handleQuillChange(content, "topCollegeOffering")
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="List top institutions that offer this course"
                    className="min-h-[150px] w-full"
                    style={{
                      minHeight: "150px",
                      maxHeight: "none",
                      overflow: "hidden",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div
            id="faq"
            ref={sectionRefs.faq}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-3xl font-bold mb-6 text-[#155DFC] border-b pb-2">
              FAQs
            </h3>

            <div className="space-y-6">
              {course?.faq?.map((faq, index) => (
                <div
                  key={`faq-${index}`}
                  className="border border-gray-200 rounded-lg p-4 mb-4"
                >
                  <h5 className="font-medium text-gray-700 mb-3">
                    FAQ {index + 1}
                  </h5>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question
                    </label>
                    <input
                      type="text"
                      value={faq.question || ""}
                      placeholder="Enter frequently asked question"
                      onChange={(e) =>
                        handleFaqChange(index, "question", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="mb-16">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Answer
                    </label>
                    <ReactQuill
                      theme="snow"
                      value={faq.answer || ""}
                      onChange={(content) =>
                        handleFaqChange(index, "answer", content)
                      }
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Provide the answer to this question"
                      className="min-h-[150px] w-full"
                      style={{
                        minHeight: "150px",
                        maxHeight: "none",
                        overflow: "hidden",
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors duration-200"
                  >
                    Remove FAQ
                  </button>
                </div>
              ))}

              <div className="mt-4">
                <button
                  type="button"
                  onClick={addFaq}
                  className="px-4 py-2 bg-[#155DFC] text-white rounded-md hover:bg-[#155DFC] transition-colors duration-200 flex items-center"
                >
                  <span className="mr-1">+</span> Add FAQ
                </button>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div
            id="benefits"
            ref={sectionRefs.benefits}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-3xl font-bold mb-6 text-[#155DFC] border-b pb-2">
              Benefits
            </h3>

            <div>
              <label
                htmlFor="benefitsOfOnlineMBA"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Benefits of This Course
              </label>
              <div className="mb-16">
                <ReactQuill
                  theme="snow"
                  value={course.benefitsOfOnlineMBA}
                  onChange={(content) =>
                    handleQuillChange(content, "benefitsOfOnlineMBA")
                  }
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Describe the key benefits of pursuing this course"
                  className="min-h-[150px] w-full"
                  style={{
                    minHeight: "150px",
                    maxHeight: "none",
                    overflow: "hidden",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center py-6">
            <button
              type="submit"
              className="px-8 py-3 bg-[#155DFC] text-white text-lg font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 transition-colors duration-200"
            >
              Send for Approval{" "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
