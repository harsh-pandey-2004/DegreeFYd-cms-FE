import React, { useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CoursesAndFeeSection = ({
  formData,
  handleChange,
  handleCourseChange,
  addCourse,
  degreeOptions,
  courseNameOptions,
  removeCourse,
  levelOptions,
  streamOptions,
  specializationOptions,
}) => {
  // Handle Quill editor changes
  const handleQuillChange = (content) => {
    handleChange({
      target: {
        name: "coursesAndFeeHeading",
        value: content,
      },
    });
  };

  // Handle duration value and unit changes
  const handleDurationChange = (index, value) => {
    handleCourseChange(index, "durationValue", value);
  };

  const handleDurationUnitChange = (index, unit) => {
    handleCourseChange(index, "durationUnit", unit);
  };

  // Format with commas for Indian numbering system
  const formatIndianNumber = (num) => {
    return num.toLocaleString("en-IN");
  };

  // Auto calculate min and max fees based on courses
  useEffect(() => {
    if (formData.coursesAndFee && formData.coursesAndFee.length > 0) {
      const fees = formData.coursesAndFee
        .map((course) => {
          if (!course.fee) return null;
          const numericString = course.fee.replace(/[^\d]/g, "");
          const numericFee = parseInt(numericString, 10);
          return isNaN(numericFee) ? null : numericFee;
        })
        .filter((fee) => fee !== null && fee > 0);

      if (fees.length > 0) {
        const minFee = Math.min(...fees);
        const maxFee = Math.max(...fees);

        // Update both values in a single batch
        handleChange({
          target: {
            name: "minFee",
            value: formatIndianNumber(minFee),
          },
        });

        handleChange({
          target: {
            name: "maxFee",
            value: formatIndianNumber(maxFee),
          },
        });
      }
    }
  }, [formData.coursesAndFee]);

  // Quill editor toolbar configuration
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
    <div className="bg-white p-6 rounded-lg shadow-md" id="courses-and-fee">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-blue-700">
        Courses and Fee
      </h2>

      {/* Courses and Fee Heading */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Courses and Fee Heading <span className="text-red-500">*</span>
        </label>
        <ReactQuill
          value={formData.coursesAndFeeHeading}
          onChange={handleQuillChange}
          modules={quillModules}
          placeholder="Enter course and fee description"
        />
      </div>

      {/* Add Course Button */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg mb-2 mt-6 text-blue-700">
            Courses
          </h3>
          <button
            type="button"
            onClick={addCourse}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Course
          </button>
        </div>
      </div>

      {/* Course Fields */}
      {formData.coursesAndFee.map((course, index) => (
        <div
          key={index}
          className="mb-6 p-6 border rounded-lg bg-gray-50 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h4 className="font-medium text-lg text-blue-600">
              Course {index + 1}
            </h4>
            {formData.coursesAndFee.length > 1 && (
              <button
                type="button"
                onClick={() => removeCourse(index)}
                className="text-red-500 hover:text-red-700 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Remove
              </button>
            )}
          </div>

          {/* Course Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
            {/* Stream Dropdown */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Stream <span className="text-red-500">*</span>
              </label>
              <select
                value={course.stream || ""}
                onChange={(e) =>
                  handleCourseChange(index, "stream", e.target.value)
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                <option value="">Select Stream</option>
                {streamOptions.map((stream) => (
                  <option key={stream} value={stream}>
                    {stream}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Dropdown */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Level <span className="text-red-500">*</span>
              </label>
              <select
                value={course.level || ""}
                onChange={(e) =>
                  handleCourseChange(index, "level", e.target.value)
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={!course.stream}
                required
              >
                <option value="">Select Level</option>
                {levelOptions.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Degree Name Dropdown */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Degree Name <span className="text-red-500">*</span>
              </label>
              <select
                value={course.degreeName || ""}
                onChange={(e) =>
                  handleCourseChange(index, "degreeName", e.target.value)
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={!course.level}
                required
              >
                <option value="">Select Degree</option>
                {degreeOptions.map((degree) => (
                  <option key={degree} value={degree}>
                    {degree}
                  </option>
                ))}
              </select>
            </div>

            {/* Specialization Dropdown */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Specialization <span className="text-red-500">*</span>
              </label>
              <select
                value={course.specialization || ""}
                onChange={(e) =>
                  handleCourseChange(index, "specialization", e.target.value)
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={!course.degreeName}
                required
              >
                <option value="">Select Specialization</option>
                {specializationOptions.map((specialization) => (
                  <option key={specialization} value={specialization}>
                    {specialization}
                  </option>
                ))}
              </select>
            </div>

            {/* Course Name Dropdown */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Course Name <span className="text-red-500">*</span>
              </label>
              <select
                value={course.courseName || ""}
                onChange={(e) =>
                  handleCourseChange(index, "courseName", e.target.value)
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={!course.specialization}
                required
              >
                <option value="">Select Course Name</option>
                {courseNameOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* College Course Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                College Course Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={course.course || ""}
                onChange={(e) =>
                  handleCourseChange(index, "course", e.target.value)
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="B.Tech Computer Science"
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Duration <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={course.durationValue || ""}
                  onChange={(e) => handleDurationChange(index, e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="4"
                  min="1"
                  required
                />
                <select
                  value={course.durationUnit || "Years"}
                  onChange={(e) =>
                    handleDurationUnitChange(index, e.target.value)
                  }
                  className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                >
                  <option value="Years">Years</option>
                  <option value="Months">Months</option>
                </select>
              </div>
            </div>

            {/* Fee */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Total Fees <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  ₹
                </span>
                <input
                  type="text"
                  value={course.fee || ""}
                  onChange={(e) =>
                    handleCourseChange(index, "fee", e.target.value)
                  }
                  className="w-full p-2 pl-8 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="50,000"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Auto-calculated Min and Max Fee Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 p-6 border rounded-lg bg-gray-50">
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Min Fee (Auto-calculated)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              ₹
            </span>
            <input
              type="text"
              name="minFee"
              value={formData.minFee || "Auto-calculated"}
              className="w-full p-2 pl-8 border rounded bg-gray-100 text-gray-700"
              placeholder="Auto-calculated"
              disabled
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Automatically shows the lowest course fee
          </p>
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Max Fee (Auto-calculated)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              ₹
            </span>
            <input
              type="text"
              name="maxFee"
              value={formData.maxFee || "Auto-calculated"}
              className="w-full p-2 pl-8 border rounded bg-gray-100 text-gray-700"
              placeholder="Auto-calculated"
              disabled
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Automatically shows the highest course fee
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoursesAndFeeSection;