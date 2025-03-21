import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../constant/utils";

const CourseCreationForm = ({ userIdprop }) => {
  const [formData, setFormData] = useState({
    courseTitle: "",
    shortDescription: "",
    mode: [],
    subAbout: "",
    subAboutItems: [{ head: "", title: "", subtitle: "" }],
    overview: "",
    myths: [],
    facts: [],
    keyHighlights: [{ title: "", description: "", icon: null }],
    duration: "",
    eligibility: {
      description: "",
      steps: [],
    },
    universities: 0,
    whyCourse: "",
    eligibilityDetails: "",
    admissionProcess: [],
    averageCourseFee: 0,
    scholarship: false,
    loanAssistance: false,
    specializations: "",
    topSpecializations: [{ title: "", text: "", icon: null }],
    specializationDetails: [{ title: "", description: "" }],
    syllabus: "",
    semester: [{ title: "", description: "", subjects: [] }],
    careerScope: "",
    baseSalary: {
      description: "",
      jobs: [{ title: "", salary: "" }],
    },
    topRecruiters: [],
    topCollegeOffering: "",
    faq: [{ title: "", answer: "" }],
    benefitsOfOnlineMBA: [],
    eligibilityImages: [],
  });
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState(null);
  const [courseLogo, setCourseLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [courseLogoPreview, setCourseLogoPreview] = useState(null);
  const [keyHighlightPreviews, setKeyHighlightPreviews] = useState([]);
  const [topSpecializationPreviews, setTopSpecializationPreviews] = useState(
    []
  );
  const [eligibilityImagePreviews, setEligibilityImagePreviews] = useState([]);
  // Handle simple input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update course logo and preview
  const handleCourseLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCourseLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle keyHighlights icon file changes with preview
  const handleKeyHighlightIconChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedHighlights = [...formData.keyHighlights];
      updatedHighlights[index] = {
        ...updatedHighlights[index],
        icon: file,
      };
      setFormData({ ...formData, keyHighlights: updatedHighlights });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...keyHighlightPreviews];
        newPreviews[index] = reader.result;
        setKeyHighlightPreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle topSpecializations icon file changes with preview
  const handleTopSpecIconChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedSpecs = [...formData.topSpecializations];
      updatedSpecs[index] = {
        ...updatedSpecs[index],
        icon: file,
      };
      setFormData({ ...formData, topSpecializations: updatedSpecs });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...topSpecializationPreviews];
        newPreviews[index] = reader.result;
        setTopSpecializationPreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fetch college data if userIdprop is provided
  useEffect(() => {
    const fetchEditDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/courses1/${userIdprop}`
        );
        if (response.data) {
          // setEditableState(response.data);

          // Update formData with the fetched data
          setFormData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching college data:", error);
      }
    };

    if (userIdprop) {
      fetchEditDetails();
    }
  }, [userIdprop]);
  useEffect(() => {
    if (userIdprop) {
      // For server-stored images, you would likely have URLs instead of File objects
      // You could set the previews to these URLs directly

      // Example (assuming formData contains image URLs after fetching from server):
      if (formData.image) {
        setMainImagePreview(formData?.image?.url);
      }

      if (formData.courseLogoUrl) {
        setCourseLogoPreview(formData.courseLogoUrl);
      }

      // Initialize key highlight previews if they exist
      if (formData.keyHighlights) {
        const initialKeyHighlightPreviews = formData.keyHighlights.map((h) =>
          h.icon ? h.icon : null
        );
        setKeyHighlightPreviews(initialKeyHighlightPreviews);
      }

      // Initialize specialization previews if they exist
      if (formData.topSpecializations) {
        const initialSpecPreviews = formData.topSpecializations.map((s) =>
          s.icon ? s.icon : null
        );
        setTopSpecializationPreviews(initialSpecPreviews);
      }

      // Initialize eligibility image previews if they exist
      // if (formData.eligibilityImageUrls) {
      //   setEligibilityImagePreviews(formData.eligibilityImageUrls);
      // }
    }
  });
  // Handle arrays of strings (comma-separated values)
  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.split(",").map((item) => item.trim()),
    });
  };

  // Handle rich text editor changes
  const handleRichTextChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle eligibility description change
  const handleEligibilityDescriptionChange = (value) => {
    setFormData({
      ...formData,
      eligibility: {
        ...formData.eligibility,
        description: value,
      },
    });
  };

  // Handle eligibility steps change
  const handleEligibilityStepsChange = (e) => {
    setFormData({
      ...formData,
      eligibility: {
        ...formData.eligibility,
        steps: e.target.value.split(",").map((item) => item.trim()),
      },
    });
  };

  // Handle keyHighlights changes
  const handleKeyHighlightChange = (index, field, value) => {
    const updatedHighlights = [...formData.keyHighlights];
    updatedHighlights[index] = {
      ...updatedHighlights[index],
      [field]: value,
    };
    setFormData({ ...formData, keyHighlights: updatedHighlights });
  };

  // Handle keyHighlights icon file changes
  // const handleKeyHighlightIconChange = (index, e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const updatedHighlights = [...formData.keyHighlights];
  //     updatedHighlights[index] = {
  //       ...updatedHighlights[index],
  //       icon: file,
  //     };
  //     setFormData({ ...formData, keyHighlights: updatedHighlights });
  //   }
  // };

  // Add a new key highlight
  const addKeyHighlight = () => {
    setFormData({
      ...formData,
      keyHighlights: [
        ...formData.keyHighlights,
        { title: "", description: "", icon: null },
      ],
    });
  };

  // Remove a key highlight
  const removeKeyHighlight = (index) => {
    const updatedHighlights = [...formData.keyHighlights];
    updatedHighlights.splice(index, 1);
    setFormData({ ...formData, keyHighlights: updatedHighlights });
  };

  // Handle topSpecializations changes
  const handleTopSpecializationChange = (index, field, value) => {
    const updatedSpecs = [...formData.topSpecializations];
    updatedSpecs[index] = {
      ...updatedSpecs[index],
      [field]: value,
    };
    setFormData({ ...formData, topSpecializations: updatedSpecs });
  };

  // Handle topSpecializations icon file changes
  // const handleTopSpecIconChange = (index, e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const updatedSpecs = [...formData.topSpecializations];
  //     updatedSpecs[index] = {
  //       ...updatedSpecs[index],
  //       icon: file,
  //     };
  //     setFormData({ ...formData, topSpecializations: updatedSpecs });
  //   }
  // };

  // Add a new top specialization
  const addTopSpecialization = () => {
    setFormData({
      ...formData,
      topSpecializations: [
        ...formData.topSpecializations,
        { title: "", text: "", icon: null },
      ],
    });
  };

  // Remove a top specialization
  const removeTopSpecialization = (index) => {
    const updatedSpecs = [...formData.topSpecializations];
    updatedSpecs.splice(index, 1);
    setFormData({ ...formData, topSpecializations: updatedSpecs });
  };

  // Handle specializationDetails changes
  const handleSpecializationDetailChange = (index, field, value) => {
    const updatedDetails = [...formData.specializationDetails];
    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: value,
    };
    setFormData({ ...formData, specializationDetails: updatedDetails });
  };

  // Add a new specialization detail
  const addSpecializationDetail = () => {
    setFormData({
      ...formData,
      specializationDetails: [
        ...formData.specializationDetails,
        { title: "", description: "" },
      ],
    });
  };

  // Remove a specialization detail
  const removeSpecializationDetail = (index) => {
    const updatedDetails = [...formData.specializationDetails];
    updatedDetails.splice(index, 1);
    setFormData({ ...formData, specializationDetails: updatedDetails });
  };

  // Handle semester changes
  const handleSemesterChange = (index, field, value) => {
    const updatedSemesters = [...formData.semester];
    updatedSemesters[index] = {
      ...updatedSemesters[index],
      [field]: value,
    };
    setFormData({ ...formData, semester: updatedSemesters });
  };

  // Handle semester subjects changes
  const handleSemesterSubjectsChange = (index, e) => {
    const updatedSemesters = [...formData.semester];
    updatedSemesters[index] = {
      ...updatedSemesters[index],
      subjects: e.target.value.split(",").map((item) => item.trim()),
    };
    setFormData({ ...formData, semester: updatedSemesters });
  };

  // Add a new semester
  const addSemester = () => {
    setFormData({
      ...formData,
      semester: [
        ...formData.semester,
        { title: "", description: "", subjects: [] },
      ],
    });
  };

  // Remove a semester
  const removeSemester = (index) => {
    const updatedSemesters = [...formData.semester];
    updatedSemesters.splice(index, 1);
    setFormData({ ...formData, semester: updatedSemesters });
  };

  // Handle baseSalary.jobs changes
  const handleJobChange = (index, field, value) => {
    const updatedJobs = [...formData.baseSalary.jobs];
    updatedJobs[index] = {
      ...updatedJobs[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      baseSalary: {
        ...formData.baseSalary,
        jobs: updatedJobs,
      },
    });
  };

  // Add a new job
  const addJob = () => {
    setFormData({
      ...formData,
      baseSalary: {
        ...formData.baseSalary,
        jobs: [...formData.baseSalary.jobs, { title: "", salary: "" }],
      },
    });
  };

  // Remove a job
  const removeJob = (index) => {
    const updatedJobs = [...formData.baseSalary.jobs];
    updatedJobs.splice(index, 1);
    setFormData({
      ...formData,
      baseSalary: {
        ...formData.baseSalary,
        jobs: updatedJobs,
      },
    });
  };

  // Handle FAQ changes
  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...formData.faq];
    updatedFaqs[index] = {
      ...updatedFaqs[index],
      [field]: value,
    };
    setFormData({ ...formData, faq: updatedFaqs });
  };

  // Add a new FAQ
  const addFaq = () => {
    setFormData({
      ...formData,
      faq: [...formData.faq, { title: "", answer: "" }],
    });
  };

  // Remove a FAQ
  const removeFaq = (index) => {
    const updatedFaqs = [...formData.faq];
    updatedFaqs.splice(index, 1);
    setFormData({ ...formData, faq: updatedFaqs });
  };

  // Handle subAboutItems changes
  const handleSubAboutItemChange = (index, field, value) => {
    const updatedItems = [...formData.subAboutItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setFormData({ ...formData, subAboutItems: updatedItems });
  };

  // Add a new subAboutItem
  const addSubAboutItem = () => {
    setFormData({
      ...formData,
      subAboutItems: [
        ...formData.subAboutItems,
        { head: "", title: "", subtitle: "" },
      ],
    });
  };

  // Remove a subAboutItem
  const removeSubAboutItem = (index) => {
    const updatedItems = [...formData.subAboutItems];
    updatedItems.splice(index, 1);
    setFormData({ ...formData, subAboutItems: updatedItems });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Create FormData object for file uploads
      const formDataToSend = new FormData();

      // Convert the form data to JSON and add to FormData
      formDataToSend.append("courseData", JSON.stringify(formData));

      // Add main course image if selected
      if (mainImage) {
        formDataToSend.append("mainImage", mainImage);
      }

      // Add course logo if selected
      if (courseLogo) {
        formDataToSend.append("courseLogo", courseLogo);
      }

      // Add keyHighlights icons
      formData.keyHighlights.forEach((highlight, index) => {
        if (highlight.icon instanceof File) {
          formDataToSend.append(`keyHighlights[${index}].icon`, highlight.icon);
        }
      });

      // Add topSpecializations icons
      formData.topSpecializations.forEach((spec, index) => {
        if (spec.icon instanceof File) {
          formDataToSend.append(`topSpecializations[${index}].icon`, spec.icon);
        }
      });

      if (userIdprop) {
        const response = await axios.put(
          `${BASE_URL}/courses1/${userIdprop}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setSuccess("Course Updated successfully!");
        window.location.reload();
        navigate("/list-courses");
      } else {
        const response = await axios.post(
          `${BASE_URL}/courses1`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setSuccess("Course created successfully!");
        window.location.reload();
        navigate("/list-courses");
      }
      // Send the form data to the server

      // Optionally reset form or redirect
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {" "}
        {userIdprop ? "Edit New Course" : "Add New Course"}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Course Information */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Course Title*</label>
              <input
                type="text"
                name="courseTitle"
                value={formData.courseTitle}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Duration</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., 2 years"
              />
            </div>

            <div>
              <label className="block mb-1">Mode of Education</label>
              <input
                type="text"
                name="mode"
                value={formData.mode.join(", ")}
                onChange={handleArrayChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Online, Offline, Hybrid (comma-separated)"
              />
            </div>

            <div>
              <label className="block mb-1">Average Course Fee</label>
              <input
                type="number"
                name="averageCourseFee"
                value={formData.averageCourseFee}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                min="0"
              />
            </div>

            <div>
              <label className="block mb-1">Number of Universities</label>
              <input
                type="number"
                name="universities"
                value={formData.universities}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                min="0"
              />
            </div>

            <div className="flex items-center space-x-4 mt-6">
              <div>
                <input
                  type="checkbox"
                  name="scholarship"
                  checked={formData.scholarship}
                  onChange={handleChange}
                  id="scholarship"
                  className="mr-2"
                />
                <label htmlFor="scholarship">Scholarship Available</label>
              </div>

              <div>
                <input
                  type="checkbox"
                  name="loanAssistance"
                  checked={formData.loanAssistance}
                  onChange={handleChange}
                  id="loanAssistance"
                  className="mr-2"
                />
                <label htmlFor="loanAssistance">Loan Assistance</label>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block mb-1">Short Description*</label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows="3"
              required
            ></textarea>
          </div>
        </div>

        {/* Course Images */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Course Images</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1">Main Course Image</label>
              <input
                type="file"
                onChange={handleMainImageChange}
                className="w-full border rounded px-3 py-2"
                accept="image/*"
              />
              {mainImagePreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Preview:</p>
                  <img
                    src={mainImagePreview}
                    alt="Main course preview"
                    className="max-h-40 border rounded"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block mb-1">Course Logo</label>
              <input
                type="file"
                onChange={handleCourseLogoChange}
                className="w-full border rounded px-3 py-2"
                accept="image/*"
              />
              {courseLogoPreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Preview:</p>
                  <img
                    src={courseLogoPreview}
                    alt="Course logo preview"
                    className="max-h-40 border rounded"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overview & About */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Overview & About</h2>

          <div className="mb-4">
            <label className="block mb-1">Course Overview</label>
            <ReactQuill
              value={formData.overview}
              onChange={(value) => handleRichTextChange("overview", value)}
              className="bg-white"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Why This Course</label>
            <ReactQuill
              value={formData.whyCourse}
              onChange={(value) => handleRichTextChange("whyCourse", value)}
              className="bg-white"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Sub About</label>
            <ReactQuill
              value={formData.subAbout}
              onChange={(value) => handleRichTextChange("subAbout", value)}
              className="bg-white"
            />
          </div>

          {/* Sub About Items */}
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Sub About Items</h3>

            {formData.subAboutItems.map((item, index) => (
              <div
                key={`subAbout-${index}`}
                className="border p-4 rounded mb-4"
              >
                <div className="flex justify-between mb-2">
                  <h4>Item {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeSubAboutItem(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1">Head</label>
                    <input
                      type="text"
                      value={item.head}
                      onChange={(e) =>
                        handleSubAboutItemChange(index, "head", e.target.value)
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        handleSubAboutItemChange(index, "title", e.target.value)
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={item.subtitle}
                      onChange={(e) =>
                        handleSubAboutItemChange(
                          index,
                          "subtitle",
                          e.target.value
                        )
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addSubAboutItem}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Sub About Item
            </button>
          </div>
        </div>

        {/* Key Highlights */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Key Highlights</h2>

          {formData.keyHighlights.map((highlight, index) => (
            <div key={`highlight-${index}`} className="border p-4 rounded mb-4">
              <div className="flex justify-between mb-2">
                <h4>Highlight {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeKeyHighlight(index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Title</label>
                  <input
                    type="text"
                    value={highlight.title}
                    onChange={(e) =>
                      handleKeyHighlightChange(index, "title", e.target.value)
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block mb-1">Description</label>
                  <input
                    type="text"
                    value={highlight.description}
                    onChange={(e) =>
                      handleKeyHighlightChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1">Icon</label>
                  <input
                    type="file"
                    onChange={(e) => handleKeyHighlightIconChange(index, e)}
                    className="w-full border rounded px-3 py-2"
                    accept="image/*"
                  />
                  {keyHighlightPreviews[index] && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Preview:</p>
                      <img
                        src={keyHighlightPreviews[index]}
                        alt={`Highlight ${index + 1} icon`}
                        className="max-h-24 border rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addKeyHighlight}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Key Highlight
          </button>
        </div>

        {/* Myths & Facts */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Myths & Facts</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1">Myths</label>
              <textarea
                name="myths"
                value={formData.myths.join(", ")}
                onChange={handleArrayChange}
                className="w-full border rounded px-3 py-2"
                rows="4"
                placeholder="Enter myths separated by commas"
              ></textarea>
            </div>

            <div>
              <label className="block mb-1">Facts</label>
              <textarea
                name="facts"
                value={formData.facts.join(", ")}
                onChange={handleArrayChange}
                className="w-full border rounded px-3 py-2"
                rows="4"
                placeholder="Enter facts separated by commas"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Eligibility & Admission */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Eligibility & Admission
          </h2>

          <div className="mb-4">
            <label className="block mb-1">Eligibility Description</label>
            <ReactQuill
              value={formData.eligibility.description}
              onChange={handleEligibilityDescriptionChange}
              className="bg-white"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Eligibility Steps</label>
            <textarea
              value={formData.eligibility.steps.join(", ")}
              onChange={handleEligibilityStepsChange}
              className="w-full border rounded px-3 py-2"
              rows="3"
              placeholder="Enter steps separated by commas"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block mb-1">
              Detailed Eligibility Information
            </label>
            <ReactQuill
              value={formData.eligibilityDetails}
              onChange={(value) =>
                handleRichTextChange("eligibilityDetails", value)
              }
              className="bg-white"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Admission Process</label>
            <textarea
              name="admissionProcess"
              value={formData.admissionProcess.join(", ")}
              onChange={handleArrayChange}
              className="w-full border rounded px-3 py-2"
              rows="3"
              placeholder="Enter steps separated by commas"
            ></textarea>
          </div>
        </div>

        {/* Specializations */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Specializations</h2>

          <div className="mb-4">
            <label className="block mb-1">Specializations Overview</label>
            <ReactQuill
              value={formData.specializations}
              onChange={(value) =>
                handleRichTextChange("specializations", value)
              }
              className="bg-white"
            />
          </div>

          {/* Top Specializations */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Top Specializations</h3>

            {formData.topSpecializations.map((spec, index) => (
              <div key={`topSpec-${index}`} className="border p-4 rounded mb-4">
                <div className="flex justify-between mb-2">
                  <h4>Specialization {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeTopSpecialization(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Title</label>
                    <input
                      type="text"
                      value={spec.title}
                      onChange={(e) =>
                        handleTopSpecializationChange(
                          index,
                          "title",
                          e.target.value
                        )
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">Text</label>
                    <input
                      type="text"
                      value={spec.text}
                      onChange={(e) =>
                        handleTopSpecializationChange(
                          index,
                          "text",
                          e.target.value
                        )
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block mb-1">Icon</label>
                    <input
                      type="file"
                      onChange={(e) => handleTopSpecIconChange(index, e)}
                      className="w-full border rounded px-3 py-2"
                      accept="image/*"
                    />
                    {topSpecializationPreviews[index] && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-1">Preview:</p>
                        <img
                          src={topSpecializationPreviews[index]}
                          alt={`Specialization ${index + 1} icon`}
                          className="max-h-24 border rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addTopSpecialization}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Top Specialization
            </button>
          </div>

          {/* Specialization Details */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Specialization Details</h3>

            {formData.specializationDetails.map((detail, index) => (
              <div
                key={`specDetail-${index}`}
                className="border p-4 rounded mb-4"
              >
                <div className="flex justify-between mb-2">
                  <h4>Detail {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeSpecializationDetail(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>

                <div>
                  <label className="block mb-1">Title</label>
                  <input
                    type="text"
                    value={detail.title}
                    onChange={(e) =>
                      handleSpecializationDetailChange(
                        index,
                        "title",
                        e.target.value
                      )
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div className="mt-2">
                  <label className="block mb-1">Description</label>
                  <ReactQuill
                    value={detail.description}
                    onChange={(value) =>
                      handleSpecializationDetailChange(
                        index,
                        "description",
                        value
                      )
                    }
                    className="bg-white"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addSpecializationDetail}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Specialization Detail
            </button>
          </div>
        </div>

        {/* Syllabus & Semesters */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Syllabus & Semesters</h2>

          <div className="mb-4">
            <label className="block mb-1">Syllabus Overview</label>
            <ReactQuill
              value={formData.syllabus}
              onChange={(value) => handleRichTextChange("syllabus", value)}
              className="bg-white"
            />
          </div>

          {/* Semesters */}
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Semester Details</h3>

            {formData.semester.map((sem, index) => (
              <div
                key={`semester-${index}`}
                className="border p-4 rounded mb-4"
              >
                <div className="flex justify-between mb-2">
                  <h4>Semester {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeSemester(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Title</label>
                    <input
                      type="text"
                      value={sem.title}
                      onChange={(e) =>
                        handleSemesterChange(index, "title", e.target.value)
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">Description</label>
                    <input
                      type="text"
                      value={sem.description}
                      onChange={(e) =>
                        handleSemesterChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block mb-1">Subjects</label>
                    <textarea
                      value={sem.subjects.join(", ")}
                      onChange={(e) => handleSemesterSubjectsChange(index, e)}
                      className="w-full border rounded px-3 py-2"
                      rows="3"
                      placeholder="Enter subjects separated by commas"
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addSemester}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Semester
            </button>
          </div>
        </div>

        {/* Career & Salary Information */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Career Information</h2>

          <div className="mb-4">
            <label className="block mb-1">Career Scope</label>
            <ReactQuill
              value={formData.careerScope}
              onChange={(value) => handleRichTextChange("careerScope", value)}
              className="bg-white"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Base Salary Description</label>
            <input
              type="text"
              value={formData.baseSalary.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  baseSalary: {
                    ...formData.baseSalary,
                    description: e.target.value,
                  },
                })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Salary Jobs */}
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">
              Salary Information by Job
            </h3>

            {formData.baseSalary.jobs.map((job, index) => (
              <div key={`job-${index}`} className="border p-4 rounded mb-4">
                <div className="flex justify-between mb-2">
                  <h4>Job {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeJob(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Job Title</label>
                    <input
                      type="text"
                      value={job.title}
                      onChange={(e) =>
                        handleJobChange(index, "title", e.target.value)
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">Salary Range</label>
                    <input
                      type="text"
                      value={job.salary}
                      onChange={(e) =>
                        handleJobChange(index, "salary", e.target.value)
                      }
                      className="w-full border rounded px-3 py-2"
                      placeholder="e.g., ₹5-8 LPA"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addJob}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Job
            </button>
          </div>

          <div className="mt-6">
            <label className="block mb-1">Top Recruiters</label>
            <textarea
              name="topRecruiters"
              value={formData.topRecruiters.join(", ")}
              onChange={handleArrayChange}
              className="w-full border rounded px-3 py-2"
              rows="3"
              placeholder="Enter top recruiters separated by commas"
            ></textarea>
          </div>

          <div className="mt-4">
            <label className="block mb-1">
              Top Colleges Offering This Course
            </label>
            <ReactQuill
              value={formData.topCollegeOffering}
              onChange={(value) =>
                handleRichTextChange("topCollegeOffering", value)
              }
              className="bg-white"
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Additional Information</h2>

          <div className="mb-4">
            <label className="block mb-1">Benefits of Online MBA</label>
            <textarea
              name="benefitsOfOnlineMBA"
              value={formData.benefitsOfOnlineMBA.join(", ")}
              onChange={handleArrayChange}
              className="w-full border rounded px-3 py-2"
              rows="3"
              placeholder="Enter benefits separated by commas"
            ></textarea>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>

          {formData.faq.map((faq, index) => (
            <div key={`faq-${index}`} className="border p-4 rounded mb-4">
              <div className="flex justify-between mb-2">
                <h4>FAQ {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeFaq(index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>

              <div>
                <label className="block mb-1">Question</label>
                <input
                  type="text"
                  value={faq.title}
                  onChange={(e) =>
                    handleFaqChange(index, "title", e.target.value)
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="mt-2">
                <label className="block mb-1">Answer</label>
                <ReactQuill
                  value={faq.answer}
                  onChange={(value) => handleFaqChange(index, "answer", value)}
                  className="bg-white"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addFaq}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add FAQ
          </button>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded font-semibold"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : `${userIdprop ? "Update Course" : "Create Course"}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseCreationForm;
