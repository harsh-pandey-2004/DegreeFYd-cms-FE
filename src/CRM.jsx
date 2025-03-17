import React, { useState, useEffect } from "react";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import BasicInfoSection from "./BasicInfoSection";
import OverviewSection from "./OverviewSection";
import CoursesAndFeeSection from "./CourseandFeeSection";
import AdmissionProcessSection from "./AdmissionProcess";
import ApprovalRankingSection from "./ApprovalsRankingSection";
import CertificatesSection from "./CertificateSection";
import PlacementSection from "./PlacementSection";
import ExamDetailsSection from "./ExamDetailsSection";
import FacultySection from "./FacultySection";
import FaqSection from "./FaqSection";
import ApprovalsSection from "./ApprovalFullForm";

export const CollegeForm = ({ userIdprop }) => {
  // Initial form data state
  const initialFormData = {
    fullFormOfApprovals: [{ abbreviation: "", fullForm: "" }],
    collegeName: "",
    collegeLocation: "",
    collegeLogo: "",
    aboutUsSub: "",
    highestPackage: "",
    averagePackage: "",
    students: "",
    nirfranking: "",
    established: "",
    collegeImage: "",
    createdBy: localStorage.getItem("userId"),
    overview: [""],
    coursesAndFeeHeading: "",
    coursesAndFee: [
      {
        stream: "",
        level: "",
        degreeName: "",
        specialization: "",
        courseName: "",
        course: "",
        duration: "",
        fee: "",
      },
    ],
    minFee: "",
    maxFee: "",
    admissionProcess: {
      description: "",
      steps: [""],
    },
    approvalAndRanking: {
      description: "",
    },
    certificates: [],
    placement: {
      description: "",
      companies: [],
      stats: {
        placementRate: "",
        highestPackage: "",
      },
      topCompanies: [""],
    },
    faculty: [""],
    examDetails: {
      difficulty: "",
      averageCGPA: "",
      minimumCGPA: "",
      other: "",
    },
    gallery: [],
    sampleDegree: {
      description: "",
      image: "",
    },
    reviews: [
      {
        name: "",
        review: [{ type: "", content: "" }],
      },
    ],
    faq: [
      {
        question: "",
        answer: "",
      },
    ],
    examPattern: {
      title: "",
      steps: [{ description: "", text: "" }],
    },
  };

  const [editableState, setEditableState] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState({});
  const [collegeId, setCollegeId] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [streamOptions, setStreamOptions] = useState([]);
  const [levelOptions, setLevelOptions] = useState([]);
  const [degreeOptions, setDegreeOptions] = useState([]);
  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [courseNameOptions, setCourseNameOptions] = useState([]);

  // Define a form ID for local storage
  const formStorageKey = userIdprop
    ? `collegeForm_${userIdprop}`
    : "collegeForm_draft";

  // Load saved form data from localStorage on initial load
  useEffect(() => {
    const savedFormData = localStorage.getItem(formStorageKey);
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
        console.log("Form data loaded from localStorage");
      } catch (e) {
        console.error("Error parsing saved form data:", e);
      }
    }
  }, [formStorageKey]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    // Don't save if it's the initial empty state or there's nothing meaningful entered
    if (
      formData &&
      (formData.collegeName || formData.aboutUsSub || formData.overview[0])
    ) {
      try {
        localStorage.setItem(formStorageKey, JSON.stringify(formData));
        console.log("Form data saved to localStorage");
      } catch (e) {
        console.error("Error saving form data:", e);
      }
    }
  }, [formData, formStorageKey]);

  // Fetch college data if userIdprop is provided
  useEffect(() => {
    const fetchEditDetails = async () => {
      try {
        const response = await axios.get(
          `https://degreefydcmsbe.onrender.com/api/colleges/collegeId/${userIdprop}`
        );

        if (response.data) {
          setEditableState(response.data);

          // Update formData with the fetched data
          setFormData((prevFormData) => {
            // Create a merged object with all fields from the fetched data
            const mergedData = { ...prevFormData };

            // Iterate through the response data and update formData
            Object.keys(response.data).forEach((key) => {
              if (key in prevFormData) {
                mergedData[key] = response.data[key];
              }
            });

            return mergedData;
          });
        }
      } catch (error) {
        console.error("Error fetching college data:", error);
      }
    };

    if (userIdprop) {
      fetchEditDetails();
    }
  }, [userIdprop]);

  // Add autosave functionality
  useEffect(() => {
    // Setup autosave every 30 seconds
    const autosaveInterval = setInterval(() => {
      if (
        formData &&
        (formData.collegeName || formData.aboutUsSub || formData.overview[0])
      ) {
        try {
          localStorage.setItem(formStorageKey, JSON.stringify(formData));
          console.log("Form data autosaved to localStorage");
        } catch (e) {
          console.error("Error autosaving form data:", e);
        }
      }
    }, 30000); // 30 seconds

    // Clean up interval on component unmount
    return () => clearInterval(autosaveInterval);
  }, [formData, formStorageKey]);

  // Clear localStorage when form is successfully submitted
  const clearSavedFormData = () => {
    localStorage.removeItem(formStorageKey);
    console.log("Cleared saved form data after successful submission");
  };

  // Function to reset form and clear localStorage
  const handleResetForm = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the form? All unsaved changes will be lost."
      )
    ) {
      setFormData(initialFormData);
      localStorage.removeItem(formStorageKey);
      setMessage("Form has been reset");
    }
  };

  // Generic handler for simple fields
  const handleChange = (e) => {
    console.log("Handling change for field:", e.target.name);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handler for array items
  const handleArrayChange = (index, value, field, subField = null) => {
    if (subField) {
      // For updating a specific field inside an array item (like question or answer in faq)
      const updatedArray = [...formData[field]];
      updatedArray[index] = {
        ...updatedArray[index],
        [subField]: value,
      };
      setFormData({
        ...formData,
        [field]: updatedArray,
      });
    } else if (index === null) {
      // For replacing the entire array (used when adding/removing items)
      setFormData({
        ...formData,
        [field]: value,
      });
    } else {
      // For updating an entire array item
      const updatedArray = [...formData[field]];
      updatedArray[index] = value;
      setFormData({
        ...formData,
        [field]: updatedArray,
      });
    }
  };

  const updateLevelOptions = (stream) => {
    axios
      .get("https://degreefydcmsbe.onrender.com/api/courses")
      .then((response) => {
        const filteredCourses = response.data.filter(
          (course) => course.Stream === stream
        );
        const levels = [
          ...new Set(filteredCourses.map((course) => course.Level)),
        ];
        setLevelOptions(levels);
        setDegreeOptions([]);
        setSpecializationOptions([]);
        setCourseNameOptions([]);
      })
      .catch((error) => console.error("Error fetching levels:", error));
  };

  const updateDegreeOptions = (stream, level) => {
    axios
      .get("https://degreefydcmsbe.onrender.com/api/courses")
      .then((response) => {
        const filteredCourses = response.data.filter(
          (course) => course.Stream === stream && course.Level === level
        );
        const degrees = [
          ...new Set(filteredCourses.map((course) => course["Degree Name"])),
        ];
        setDegreeOptions(degrees);
        setSpecializationOptions([]);
        setCourseNameOptions([]);
      })
      .catch((error) => console.error("Error fetching degrees:", error));
  };

  const updateSpecializationOptions = (stream, level, degree) => {
    axios
      .get("https://degreefydcmsbe.onrender.com/api/courses")
      .then((response) => {
        const filteredCourses = response.data.filter(
          (course) =>
            course.Stream === stream &&
            course.Level === level &&
            course["Degree Name"] === degree
        );
        const specializations = [
          ...new Set(filteredCourses.map((course) => course.Specialization)),
        ];
        setSpecializationOptions(specializations);
        setCourseNameOptions([]);
      })
      .catch((error) =>
        console.error("Error fetching specializations:", error)
      );
  };

  const updateCourseNameOptions = (stream, level, degree, specialization) => {
    axios
      .get("https://degreefydcmsbe.onrender.com/api/courses")
      .then((response) => {
        const filteredCourses = response.data.filter(
          (course) =>
            course.Stream === stream &&
            course.Level === level &&
            course["Degree Name"] === degree &&
            course.Specialization === specialization
        );
        const courseNames = filteredCourses.map(
          (course) => course["Course Name"]
        );
        setCourseNameOptions(courseNames);
      })
      .catch((error) => console.error("Error fetching course names:", error));
  };

  // Handler for nested fields
  const handleNestedChange = (e, parent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [parent]: {
        ...formData[parent],
        [name]: value,
      },
    });
  };

  // Handler for deeply nested fields
  const handleDeepNestedChange = (e, parent, nestedField) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [parent]: {
        ...formData[parent],
        [nestedField]: {
          ...formData[parent][nestedField],
          [name]: value,
        },
      },
    });
  };

  // Handler for nested array items
  const handleNestedArrayChange = (index, value, parent, arrayField) => {
    const updatedParent = { ...formData[parent] };
    const updatedArray = [...updatedParent[arrayField]];
    updatedArray[index] = value;
    updatedParent[arrayField] = updatedArray;

    setFormData({
      ...formData,
      [parent]: updatedParent,
    });
    streamOptions;
  };

  // Handler for courses array
  // Handler for courses array - fixed version
  const handleCourseChange = (index, field, value) => {
    console.log(
      "handleCourseChange called with index:",
      index,
      "field:",
      field,
      "value:",
      value,
      formData.coursesAndFee
    );
    setFormData((prevData) => {
      const updatedCourses = [...prevData.coursesAndFee];

      // Update only the specified field for the current course
      updatedCourses[index] = {
        ...updatedCourses[index],
        [field]: value,
      };

      // Reset dependent fields only for the current course if needed
      if (field === "stream") {
        updatedCourses[index] = {
          ...updatedCourses[index],
          level: "",
          degreeName: "",
          specialization: "",
          courseName: "",
          course: "",
        };
        // Update dropdown options for the current selection
        updateLevelOptions(value);
      } else if (field === "level") {
        updatedCourses[index] = {
          ...updatedCourses[index],
          degreeName: "",
          specialization: "",
          courseName: "",
          course: "",
        };
        // Only update options if we have the required field value
        if (updatedCourses[index].stream) {
          updateDegreeOptions(updatedCourses[index].stream, value);
        }
      } else if (field === "degreeName") {
        updatedCourses[index] = {
          ...updatedCourses[index],
          specialization: "",
          courseName: "",
          course: "",
        };
        // Only update if we have the required field values
        if (updatedCourses[index].stream && updatedCourses[index].level) {
          updateSpecializationOptions(
            updatedCourses[index].stream,
            updatedCourses[index].level,
            value
          );
        }
      } else if (field === "specialization") {
        updatedCourses[index] = {
          ...updatedCourses[index],
          courseName: "",
        };
        // Only update if we have all required field values
        if (
          updatedCourses[index].stream &&
          updatedCourses[index].level &&
          updatedCourses[index].degreeName
        ) {
          updateCourseNameOptions(
            updatedCourses[index].stream,
            updatedCourses[index].level,
            updatedCourses[index].degreeName,
            value
          );
        }
      } else if (field === "courseName") {
        const streamAbbr = updatedCourses[index].stream
          ? updatedCourses[index].stream.substring(0, 3).toUpperCase()
          : "";
        const degreeAbbr = updatedCourses[index].degreeName || "";
        updatedCourses[
          index
        ].course = `${streamAbbr} - ${degreeAbbr} in ${value}`;
      }

      return { ...prevData, coursesAndFee: updatedCourses };
    });
  };

  // Add new course
  const addCourse = () => {
    setFormData({
      ...formData,
      coursesAndFee: [
        ...formData.coursesAndFee,
        {
          stream: "",
          level: "",
          degreeName: "",
          specialization: "",
          courseName: "",
          course: "",
          duration: "",
          fee: "",
        },
      ],
    });
  };

  // Remove a course
  const removeCourse = (index) => {
    const updatedCourses = [...formData.coursesAndFee];
    updatedCourses.splice(index, 1);
    setFormData({
      ...formData,
      coursesAndFee: updatedCourses,
    });
  };

  // Handle review field changes
  const handleReviewChange = (reviewIndex, field, value) => {
    const updatedReviews = [...formData.reviews];
    updatedReviews[reviewIndex] = {
      ...updatedReviews[reviewIndex],
      [field]: value,
    };
    setFormData({
      ...formData,
      reviews: updatedReviews,
    });
  };

  // Handle review item changes
  const handleReviewItemChange = (reviewIndex, itemIndex, field, value) => {
    const updatedReviews = [...formData.reviews];
    if (!updatedReviews[reviewIndex].review) {
      updatedReviews[reviewIndex].review = [];
    }

    if (!updatedReviews[reviewIndex].review[itemIndex]) {
      updatedReviews[reviewIndex].review[itemIndex] = {};
    }

    updatedReviews[reviewIndex].review[itemIndex] = {
      ...updatedReviews[reviewIndex].review[itemIndex],
      [field]: value,
    };

    setFormData({
      ...formData,
      reviews: updatedReviews,
    });
  };

  // Add new review
  const addReview = () => {
    setFormData({
      ...formData,
      reviews: [
        ...formData.reviews,
        {
          name: "",
          review: [{ type: "", content: "" }],
        },
      ],
    });
  };

  // Add new review item
  const addReviewItem = (reviewIndex) => {
    const updatedReviews = [...formData.reviews];
    if (!updatedReviews[reviewIndex].review) {
      updatedReviews[reviewIndex].review = [];
    }
    updatedReviews[reviewIndex].review.push({ type: "", content: "" });

    setFormData({
      ...formData,
      reviews: updatedReviews,
    });
  };

  // Remove a review item
  const removeReviewItem = (reviewIndex, itemIndex) => {
    const updatedReviews = [...formData.reviews];
    updatedReviews[reviewIndex].review.splice(itemIndex, 1);

    setFormData({
      ...formData,
      reviews: updatedReviews,
    });
  };

  // Remove a review
  const removeReview = (reviewIndex) => {
    const updatedReviews = [...formData.reviews];
    updatedReviews.splice(reviewIndex, 1);

    setFormData({
      ...formData,
      reviews: updatedReviews,
    });
  };

  // Handle single file upload to Cloudinary
  const handleSingleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    // Start progress
    setLoading(true);
    setUploadProgress({ ...uploadProgress, [field]: 10 });

    try {
      // Read file as data URL (similar to multiple upload)
      const fileDataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target.result);
        };
        reader.readAsDataURL(file);
      });

      // Simulate progress (like in multiple upload function)
      let progress = 10;
      const interval = setInterval(() => {
        progress += 15;
        if (progress <= 90) {
          setUploadProgress((prev) => ({ ...prev, [field]: progress }));
        } else {
          clearInterval(interval);
        }
      }, 100);

      // Complete progress
      setUploadProgress({ ...uploadProgress, [field]: 100 });

      // Handle nested fields (similar to your original code)
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: fileDataUrl,
          },
        });
      } else {
        setFormData({
          ...formData,
          [field]: fileDataUrl,
        });
      }

      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress((prev) => ({ ...prev, [field]: 0 }));
        setLoading(false);
        setMessage(`Image for ${field} processed successfully`);
      }, 1000);
    } catch (error) {
      console.error("Error processing file:", error);
      setLoading(false);
      setUploadProgress({ ...uploadProgress, [field]: 0 });
      setMessage(`Error processing image: ${error.message}`);
    }
  };

  const handleMultipleFileUpload = (e, field) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Start progress
    setUploadProgress({ ...uploadProgress, [field]: 10 });

    const uploadPromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target.result);
        };
        reader.readAsDataURL(file);
      });
    });

    // Simulate progress
    let progress = 10;
    const interval = setInterval(() => {
      progress += 10;
      if (progress <= 90) {
        setUploadProgress((prev) => ({ ...prev, [field]: progress }));
      } else {
        clearInterval(interval);
      }
    }, 100);

    Promise.all(uploadPromises).then((imageResults) => {
      // Complete progress
      setUploadProgress({ ...uploadProgress, [field]: 100 });

      // Update form data with new images
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: [...prev[parent][child], ...imageResults],
        },
      }));

      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress((prev) => ({ ...prev, [field]: 0 }));
      }, 1000);
    });
  };

  // Handle multiple file uploads to Cloudinary
  const handleMultipleFileUpload1 = (e, field) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Start progress
    setUploadProgress({ ...uploadProgress, [field]: 10 });

    const uploadPromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target.result);
        };
        reader.readAsDataURL(file);
      });
    });

    // Simulate progress
    let progress = 10;
    const interval = setInterval(() => {
      progress += 10;
      if (progress <= 90) {
        setUploadProgress((prev) => ({ ...prev, [field]: progress }));
      } else {
        clearInterval(interval);
      }
    }, 100);

    Promise.all(uploadPromises).then((imageResults) => {
      // Complete progress
      setUploadProgress({ ...uploadProgress, [field]: 100 });

      // Update form data with new images
      if (field.includes(".")) {
        // Handle nested fields (like "company.logos")
        const [parent, child] = field.split(".");
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...(prev[parent] || {}),
            [child]: [...(prev[parent]?.[child] || []), ...imageResults],
          },
        }));
      } else {
        // Handle direct fields (like "gallery")
        setFormData((prev) => ({
          ...prev,
          [field]: [...(prev[field] || []), ...imageResults],
        }));
      }

      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress((prev) => ({ ...prev, [field]: 0 }));
      }, 1000);
    });
  };

  // Function to remove an image from an array
  const handleRemoveImage1 = (index, field) => {
    // Handle nested fields
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: prev[parent][child].filter((_, i) => i !== index),
        },
      }));
    } else {
      // Handle direct fields
      setFormData((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Create a new formatted object with the correct structure
      const formattedData = {
        ...formData,
        createdBy: localStorage.getItem("userId"),
        coursesAndFee: formData.coursesAndFee.map((course) => ({
          CourseName: course.courseName,
          stream: course.stream,
          level: course.level,
          DegreeName: course.degreeName,
          Specialization: course.specialization,
          duration: course.duration,
          fee: Number(course.fee),
          course: course.course,
          // Don't include _id as MongoDB will auto-generate it for new entries
        })),
      };

      console.log("Submitting data:", formattedData);

      let response;
      console.log(collegeId, "harsgh");
      if (userIdprop) {
        console.log("Editing college with ID:", userIdprop);
        response = await axios.put(
          `https://degreefydcmsbe.onrender.com/api/colleges/${userIdprop}`,
          formattedData
        );
        alert("College Approved Request Send Successfuly!");
        navigate("/dashboard");
        window.location.reload();
        setMessage("College Approved Request Send Successfuly!");
      } else {
        response = await axios.post(
          "https://degreefydcmsbe.onrender.com/api/colleges",
          formattedData
        );
        alert("College Approved Request Send Successfuly!");
        navigate("/dashboard");

        setMessage("College Approved Request Send Successfuly!");
      }

      console.log("Success:", response.data);
      setLoading(false);
      localStorage.removeItem(formStorageKey);
      // Clear saved form data from localStorage after successful submission
      clearSavedFormData();
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
      alert("Error Adding College");
      console.error("Error submitting form:", error);
      setLoading(false);
    }
  };

  const addOverviewPoint = () => {
    setFormData({
      ...formData,
      overview: [...formData.overview, ""],
    });
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://degreefydcmsbe.onrender.com/api/courses"
        );
        if (response.data) {
          // Extract unique streams
          const streams = [
            ...new Set(response.data.map((course) => course.Stream)),
          ];
          setStreamOptions(streams);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const removeOverviewPoint = (index) => {
    const updatedOverview = [...formData.overview];
    updatedOverview.splice(index, 1);
    setFormData({
      ...formData,
      overview: updatedOverview,
    });
  };

  const addAdmissionStep = () => {
    const updatedSteps = [...formData.admissionProcess.steps, ""];
    setFormData({
      ...formData,
      admissionProcess: {
        ...formData.admissionProcess,
        steps: updatedSteps,
      },
    });
  };

  const removeAdmissionStep = (index) => {
    const updatedSteps = [...formData.admissionProcess.steps];
    updatedSteps.splice(index, 1);
    setFormData({
      ...formData,
      admissionProcess: {
        ...formData.admissionProcess,
        steps: updatedSteps,
      },
    });
  };

  const handleAddStep = () => {
    const updatedSteps = [
      ...formData.examPattern.steps,
      { description: "", text: "" },
    ];
    setFormData({
      ...formData,
      examPattern: {
        ...formData.examPattern,
        steps: updatedSteps,
      },
    });
  };

  const handleRemoveStep = (index) => {
    if (formData.examPattern.steps.length > 1) {
      const updatedSteps = [...formData.examPattern.steps];
      updatedSteps.splice(index, 1); // Remove the specific step

      setFormData({
        ...formData,
        examPattern: {
          ...formData.examPattern,
          steps: updatedSteps,
        },
      });
    }
  };

  const handleAddCompany = () => {
    setFormData({
      ...formData,
      placement: {
        ...formData.placement,
        topCompanies: [...formData.placement.topCompanies, ""],
      },
    });
  };
  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...formData.examPattern.steps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      examPattern: {
        ...formData.examPattern,
        steps: updatedSteps,
      },
    });
  };
  const handleRemoveCompany = (index) => {
    if (formData.placement.topCompanies.length <= 1) return;

    const updatedCompanies = formData.placement.topCompanies.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      placement: {
        ...formData.placement,
        topCompanies: updatedCompanies,
      },
    });
  };

  const handleRemoveImage = (indexToRemove, parent, child) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: prev[parent][child].filter(
          (_, index) => index !== indexToRemove
        ),
      },
    }));
  };

  // Display last saved time
  const [lastSavedTime, setLastSavedTime] = useState(null);

  // Update last saved time
  useEffect(() => {
    if (
      formData &&
      (formData.collegeName || formData.aboutUsSub || formData.overview[0])
    ) {
      setLastSavedTime(new Date());
    }
  }, [formData]);
  return (
    <div className="max-w-6xl mx-auto px-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {" "}
        {userIdprop ? "Edit New College" : "Add New College"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <BasicInfoSection
          formData={formData}
          handleChange={handleChange}
          handleSingleFileUpload={handleSingleFileUpload}
          uploadProgress={uploadProgress}
          setFormData={setFormData}
        />

        <OverviewSection
          formData={formData}
          handleArrayChange={handleArrayChange}
          addOverviewPoint={addOverviewPoint}
          removeOverviewPoint={removeOverviewPoint}
        />

        <CoursesAndFeeSection
          userIdprop={userIdprop}
          formData={formData}
          handleChange={handleChange}
          handleCourseChange={handleCourseChange}
          addCourse={addCourse}
          degreeOptions={degreeOptions}
          courseNameOptions={courseNameOptions}
          removeCourse={removeCourse}
          levelOptions={levelOptions}
          streamOptions={streamOptions}
          specializationOptions={specializationOptions}
        />

        <AdmissionProcessSection
          formData={formData}
          handleNestedChange={handleNestedChange}
          handleNestedArrayChange={handleNestedArrayChange}
          addAdmissionStep={addAdmissionStep}
          removeAdmissionStep={removeAdmissionStep}
        />

        <ApprovalRankingSection
          formData={formData}
          handleNestedChange={handleNestedChange}
        />
        <ApprovalsSection formData={formData} setFormData={setFormData} />
        <CertificatesSection
          handleRemoveImage1={handleRemoveImage1}
          formData={formData}
          handleMultipleFileUpload1={handleMultipleFileUpload1}
          uploadProgress={uploadProgress}
        />

        <PlacementSection
          formData={formData}
          setFormData={setFormData}
          handleNestedArrayChange={handleNestedArrayChange}
          uploadProgress={uploadProgress}
          handleAddCompany={handleAddCompany}
          handleRemoveCompany={handleRemoveCompany}
          handleDeepNestedChange={handleDeepNestedChange}
          handleMultipleFileUpload={handleMultipleFileUpload}
        />

        <FacultySection
          formData={formData}
          setFormData={setFormData}
          handleArrayChange={handleArrayChange}
        />
        <FaqSection formData={formData} handleArrayChange={handleArrayChange} />

        <ExamDetailsSection
          handleRemoveStep={handleRemoveStep}
          handleAddStep={handleAddStep}
          formData={formData}
          handleNestedChange={handleNestedChange}
          handleRemoveImage={handleRemoveImage}
          handleMultipleFileUpload1={handleMultipleFileUpload1}
          uploadProgress={uploadProgress}
          handleSingleFileUpload={handleSingleFileUpload}
          handleRemoveImage1={handleRemoveImage1}
          removeReview={removeReview}
          addReview={addReview}
          handleReviewChange={handleReviewChange}
          removeReviewItem={removeReviewItem}
          handleReviewItemChange={handleReviewItemChange}
          addReviewItem={addReviewItem}
          handleNestedArrayChange={handleNestedArrayChange}
          isEditMode={isEditMode}
          loading={loading}
          setFormData={setFormData}
          handleStepChange={handleStepChange}
        />
      </form>
    </div>
  );
};
