import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ExamDetailsSection = ({
  formData,
  setFormData,
  handleAddStep,
  handleNestedChange,
  handleRemoveImage,
  handleMultipleFileUpload1,
  uploadProgress,
  handleSingleFileUpload,
  handleRemoveImage1,
  removeReview,
  addReview,
  handleReviewChange,
  removeReviewItem,
  handleReviewItemChange,
  addReviewItem,
  handleNestedArrayChange,
  isEditMode,
  loading,
  handleRemoveStep,
}) => {
  // State for tracking active section
  const [activeId, setActiveId] = useState("exam-information");

  // Effect to detect which section is in view during scrolling
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Adding offset for better detection

      // Array of section IDs to check
      const sections = [
        "exam-information",
        "gallery",
        "sample-degree",
        "student-reviews",
        "exam-pattern",
      ];

      // Find the section that is currently in view
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveId(id);
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
  }, []);

  // Custom function to handle Quill editor changes
  const handleQuillChange = (
    value,
    field,
    nestedField = null,
    index = null,
    subIndex = null,
    subField = null
  ) => {
    if (nestedField && index !== null && subIndex !== null && subField) {
      // For deeply nested fields like reviews[index].review[subIndex].content
      const updatedData = { ...formData };
      updatedData[nestedField][index][field][subIndex][subField] = value;
      setFormData(updatedData);
    } else if (nestedField && index !== null) {
      // For nested array fields like examPattern.steps[index]
      const updatedData = { ...formData };
      updatedData[nestedField][field][index] = value;
      setFormData(updatedData);
    } else if (nestedField) {
      // For nested fields like examDetails.other
      const updatedData = { ...formData };
      updatedData[nestedField][field] = value;
      setFormData(updatedData);
    } else {
      // For top-level fields
      const updatedData = { ...formData };
      updatedData[field] = value;
      setFormData(updatedData);
    }
  };

  // Quill modules configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  return (
    <div className="">
      {/* Sidebar */}

      {/* Main Content */}
      <div className=" ">
        <div className="bg-white p-6 rounded-lg shadow-md w-full" id="exam-details">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-3 text-blue-800">
            Exam Details
          </h2>

          <div className="">
            {/* Exam Information Card */}
            <div 
              id="exam-information"
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-blue-700">
                Exam Information
              </h2>

              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Difficulty <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="difficulty"
                    value={formData.examDetails.difficulty}
                    onChange={(e) => handleNestedChange(e, "examDetails")}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Moderate, High, Low"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Average CGPA <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="averageCGPA"
                    value={formData.examDetails.averageCGPA}
                    onChange={(e) => handleNestedChange(e, "examDetails")}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 8.5"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Minimum CGPA <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="minimumCGPA"
                    value={formData.examDetails.minimumCGPA}
                    onChange={(e) => handleNestedChange(e, "examDetails")}
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 7.0"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Other Details <span className="text-red-500">*</span>
                  </label>
                  <ReactQuill
                    theme="snow"
                    value={formData.examDetails.other}
                    onChange={(value) =>
                      handleQuillChange(value, "other", "examDetails")
                    }
                    modules={quillModules}
                    className="bg-white rounded-md"
                    placeholder="Enter additional exam details here..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Gallery Images */}
            <div 
              id="gallery"
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 mt-5"
            >
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-blue-700">
                Gallery Images <span className="text-red-500">*</span>
              </h2>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">
                  Upload Gallery
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleMultipleFileUpload1(e, "gallery")}
                  className="w-full p-3 border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors duration-200"
                  accept="image/*"
                  required={formData.gallery.length === 0}
                />
                {uploadProgress["gallery"] > 0 &&
                  uploadProgress["gallery"] < 100 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${uploadProgress["gallery"]}%`,
                        }}
                      ></div>
                    </div>
                  )}
              </div>

              {formData.gallery && formData.gallery.length > 0 ? (
                <div className="mt-5">
                  <h3 className="font-medium mb-3 text-gray-700">
                    Uploaded Gallery ({formData.gallery.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.gallery.map((image, index) => (
                      <div
                        key={index}
                        className="border p-2 rounded-md relative group transition-all duration-200 hover:shadow-md"
                      >
                        <img
                          src={image}
                          alt={`gallery ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage1(index, "gallery")}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className=" text-sm mt-2">
                  *At least one gallery image is required
                </p>
              )}
            </div>

            {/* Sample Degree */}
            <div 
              id="sample-degree"
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 mt-5"
            >
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-blue-700">
                Sample Degree <span className="text-red-500">*</span>
              </h2>

              <div className="mb-5">
                <label className="block mb-2 font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <ReactQuill
                  theme="snow"
                  value={formData.sampleDegree.description}
                  onChange={(value) =>
                    handleQuillChange(value, "description", "sampleDegree")
                  }
                  modules={quillModules}
                  className="bg-white rounded-md"
                  placeholder="Describe the sample degree..."
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium text-gray-700">
                  Sample Degree Image <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  onChange={(e) => handleSingleFileUpload(e, "sampleDegree.image")}
                  className="w-full p-3 border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors duration-200"
                  accept="image/*"
                  required={!formData.sampleDegree.image}
                />
                {uploadProgress["sampleDegree.image"] > 0 &&
                  uploadProgress["sampleDegree.image"] < 100 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${uploadProgress["sampleDegree.image"]}%`,
                        }}
                      ></div>
                    </div>
                  )}

                {formData.sampleDegree.image ? (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 font-medium">
                      Uploaded Image:
                    </p>
                    <div className="relative mt-2 inline-block">
                      <img
                        src={formData.sampleDegree.image}
                        alt="Sample Degree"
                        className="max-h-48 rounded-md border shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage("sampleDegree.image")}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className=" text-sm mt-2">
                    *Sample degree image is required
                  </p>
                )}
              </div>
            </div>

            {/* Student Reviews */}
            <div 
              id="student-reviews"
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 mt-5"
            >
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-blue-700">
                Student Reviews <span className="text-red-500">*</span>
              </h2>

              {formData.reviews.length > 0 ? (
                formData.reviews.map((review, reviewIndex) => (
                  <div
                    key={reviewIndex}
                    className="mb-6 p-5 border rounded-md bg-gray-50 transition-all duration-200 hover:shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-blue-700">
                        Review {reviewIndex + 1}
                      </h4>
                      {formData.reviews.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeReview(reviewIndex)}
                          className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block mb-2 font-medium text-gray-700">
                        Student Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={review.name || ""}
                        onChange={(e) =>
                          handleReviewChange(reviewIndex, "name", e.target.value)
                        }
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter student name"
                        required
                      />
                    </div>

                    <h5 className="font-medium mt-5 mb-3 text-gray-700">
                      Review Content <span className="text-red-500">*</span>
                    </h5>

                    {review.review && review.review.length > 0 ? (
                      review.review.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="mb-5 p-4 border rounded-md bg-white shadow-sm"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <h6 className="font-medium text-gray-700">
                              Item {itemIndex + 1}
                            </h6>
                            <button
                              type="button"
                              onClick={() =>
                                removeReviewItem(reviewIndex, itemIndex)
                              }
                              className="text-red-500 hover:text-red-700 text-sm flex items-center"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Remove
                            </button>
                          </div>

                          <div className="mb-4">
                            <label className="block mb-2 font-medium text-gray-700">
                              Type <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={item.type || ""}
                              onChange={(e) =>
                                handleReviewItemChange(
                                  reviewIndex,
                                  itemIndex,
                                  "type",
                                  e.target.value
                                )
                              }
                              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g. Positive, Negative, Course, Faculty"
                              required
                            />
                          </div>

                          <div>
                            <label className="block mb-2 font-medium text-gray-700">
                              Content <span className="text-red-500">*</span>
                            </label>
                            <ReactQuill
                              theme="snow"
                              value={item.content || ""}
                              onChange={(value) =>
                                handleReviewItemChange(
                                  reviewIndex,
                                  itemIndex,
                                  "content",
                                  value
                                )
                              }
                              modules={quillModules}
                              className="bg-white rounded-md"
                              placeholder="Enter review content here..."
                              required
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-red-500 text-sm">
                        At least one review item is required
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => addReviewItem(reviewIndex)}
                      className="mt-3 px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors duration-200 flex items-center text-sm font-medium"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add Review Item
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-red-500 text-sm mb-4">
                  At least one student review is required
                </p>
              )}

              <button
                type="button"
                onClick={addReview}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center text-sm font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Add New Review
              </button>
            </div>

            {/* Exam Pattern */}
            <div 
              id="exam-pattern"
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 mt-5"
            >
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-blue-700">
                Exam Pattern <span className="text-red-500">*</span>
              </h2>

              <div className="mb-5">
                <label className="block mb-2 font-medium text-gray-700">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.examPattern.title}
                  onChange={(e) => handleNestedChange(e, "examPattern")}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Entrance Exam Pattern"
                  required
                />
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="font-medium text-gray-700">
                    Steps <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Step
                  </button>
                </div>

                {formData.examPattern.steps.length > 0 ? (
                  formData.examPattern.steps.map((step, index) => (
                    <div
                      key={index}
                      className="mb-5 relative border p-5 rounded-md shadow-sm bg-white"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <label className="font-medium text-blue-700">
                          Step {index + 1}
                        </label>
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(index)}
                          className="px-2 py-1 text-red-500 hover:text-red-700 rounded-md text-sm flex items-center"
                          disabled={formData.examPattern.steps.length <= 1}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Remove
                        </button>
                      </div>
                      <ReactQuill
                        theme="snow"
                        value={step}
                        onChange={(value) =>
                          handleNestedArrayChange(
                            index,
                            value,
                            "examPattern",
                            "steps"
                          )
                        }
                        modules={quillModules}
                        className="bg-white rounded-md"
                        placeholder="Describe this step of the exam pattern..."
                        required
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-red-500 text-sm">
                    At least one step is required
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-10 text-center">
            <button
              type="submit"
              className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-200 flex items-center justify-center mx-auto"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  {isEditMode ? "Update College" : "Send for Approval"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailsSection;
