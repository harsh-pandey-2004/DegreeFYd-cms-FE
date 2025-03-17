  import React, { useEffect, useRef, useState } from "react";
  import ReactQuill from "react-quill";
  import "react-quill/dist/quill.snow.css";

  const CoursesAndFeeSection = ({
    formData,
    userIdprop,
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
    // Initialize search states for each dropdown
    const [searchStates, setSearchStates] = useState({
      stream: Array(formData.coursesAndFee.length).fill(""),
      level: Array(formData.coursesAndFee.length).fill(""),
      degreeName: Array(formData.coursesAndFee.length).fill(""),
      specialization: Array(formData.coursesAndFee.length).fill(""),
      courseName: Array(formData.coursesAndFee.length).fill(""),
      course: Array(formData?.course?.length).fill(""),
    });

    // Update search states when a new course is added
    useEffect(() => {
      if (formData.coursesAndFee.length > searchStates.stream.length) {
        setSearchStates((prev) => {
          const newSearchStates = { ...prev };
          Object.keys(newSearchStates).forEach((key) => {
            newSearchStates[key] = [...newSearchStates[key], ""];
          });
          return newSearchStates;
        });
      }
    }, [formData.coursesAndFee.length]);

    // Update search field for a specific dropdown
    const updateSearchState = (index, field, value) => {
      setSearchStates((prev) => {
        const newState = { ...prev };
        newState[field][index] = value;
        return newState;
      });
    };

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
      handleCourseChange(index, "duration", value);
    };

    const handleDurationUnitChange = (index, unit) => {
      handleCourseChange(index, "durationUnit", unit);
    };
    const handlecourse1chnage = (index, unit) => {
      handleCourseChange(index, "course", unit);
    };

    // Format with commas for Indian numbering system
    const formatIndianNumber = (num) => {
      return num.toLocaleString("en-IN");
    };

    // Ref for minFee input
    const minFeeRef = useRef(null);

    // Auto calculate min and max fees based on courses
    useEffect(() => {
      if (formData.coursesAndFee && formData.coursesAndFee.length > 0) {
        const fees = formData.coursesAndFee
          .map((course) => {
            if (!course.fee) return null;

            // Remove any non-numeric characters (e.g., commas)
            const numericString = course.fee.replace(/[^\d]/g, "");
            const numericFee = parseInt(numericString, 10);

            // Return null if the fee is not a valid number
            return isNaN(numericFee) ? null : numericFee;
          })
          .filter((fee) => fee !== null && fee > 0); // Filter out null and non-positive fees

        // Only update min and max fees if there are valid fees
        if (fees.length > 0) {
          const minFee = Math.min(...fees);
          const maxFee = Math.max(...fees);

          // Update the ref value for minFee
          if (minFeeRef.current) {
            minFeeRef.current.value = formatIndianNumber(minFee);
          }

          handleChange({
            target: {
              name: "minFee",
              value: minFee,
            },
          });

          handleChange({
            target: {
              name: "maxFee",
              value: formatIndianNumber(maxFee),
            },
          });
        } else {
          // If no valid fees, reset min and max fees
          if (minFeeRef.current) {
            minFeeRef.current.value = "No valid fees";
          }

          handleChange({
            target: {
              name: "minFee",
              value: "",
            },
          });

          handleChange({
            target: {
              name: "maxFee",
              value: "",
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

    // Filter options based on search input
    const filterOptions = (options, searchTerm) => {
      if (!searchTerm) return options;
      return options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      );
    };

    // Custom searchable dropdown component
    const SearchableDropdown = ({
      label,
      value,
      onChange,
      options,
      index,
      fieldName,
      placeholder = "Search...",
      required = false,
      disabled = false,
    }) => {
      const [isOpen, setIsOpen] = useState(false);

      // Get the current search value for this field and index
      const searchValue = searchStates[fieldName][index] || "";

      // Set search value handler
      const setSearchValue = (value) => {
        updateSearchState(index, fieldName, value);
      };

      const filteredOptions = filterOptions(options, searchValue);

      return (
        <div className="relative">
          <label className="block mb-2 font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <div
              className={`flex justify-between items-center w-full p-2 border rounded focus:ring-2 focus:ring-violet-600 focus:outline-none cursor-pointer ${
                disabled ? "bg-gray-100" : "bg-white"
              }`}
              onClick={() => !disabled && setIsOpen(!isOpen)}
            >
              <div className="truncate">{value || placeholder}</div>
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>

            {isOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                <div className="sticky top-0 z-10 bg-white p-2 border-b">
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-violet-600 focus:outline-none"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div>
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                      <div
                        key={option}
                        className={`p-2 hover:bg-blue-100 cursor-pointer ${
                          value === option ? "bg-blue-50" : ""
                        }`}
                        onClick={() => {
                          onChange({ target: { value: option } });
                          setIsOpen(false);
                          setSearchValue("");
                        }}
                      >
                        {option}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No options found</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-md" id="courses-and-fee">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-violet-600">
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
            <h3 className="font-medium text-lg mb-2 mt-6 text-violet-600">
              Courses
            </h3>
            <button
              type="button"
              onClick={addCourse}
              className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-600 flex items-center"
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
              <h4 className="font-medium text-lg text-violet-600">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Stream Dropdown - Searchable */}
              <SearchableDropdown
                label="Stream"
                value={course.stream || ""}
                onChange={(e) =>
                  handleCourseChange(index, "stream", e.target.value)
                }
                options={streamOptions}
                index={index}
                fieldName="stream"
                placeholder="Select Stream"
                required={true}
              />

              {/* Level Dropdown - Searchable */}
              <SearchableDropdown
                label="Level"
                value={course.level || ""}
                onChange={(e) =>
                  handleCourseChange(index, "level", e.target.value)
                }
                options={levelOptions}
                index={index}
                fieldName="level"
                placeholder="Select Level"
                required={true}
              />

              {/* Degree Name Dropdown - Searchable */}
              <SearchableDropdown
                label="Degree Name"
                value={course.degreeName || course.DegreeName || ""}
                onChange={(e) =>
                  handleCourseChange(index, "degreeName", e.target.value)
                }
                options={degreeOptions}
                index={index}
                fieldName="degreeName"
                placeholder="Select Degree"
                required={true}
              />

              {/* Specialization Dropdown - Searchable */}
              <SearchableDropdown
                label="Specialization"
                value={course.specialization || course.Specialization || ""}
                onChange={(e) =>
                  handleCourseChange(index, "specialization", e.target.value)
                }
                options={specializationOptions}
                index={index}
                fieldName="specialization"
                placeholder="Select Specialization"
                required={true}
              />

              {/* Course Name Dropdown - Searchable */}
              <SearchableDropdown
                label="Course Name"
                value={course.courseName || course.CourseName || ""}
                onChange={(e) =>
                  handleCourseChange(index, "courseName", e.target.value)
                }
                options={courseNameOptions}
                index={index}
                fieldName="courseName"
                placeholder="Select Course Name"
                required={true}
              />

              {/* College Course Name */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  College Course Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={
                    course.course ||  course.course || ""
                  }
                  onChange={(e) =>
                    handleCourseChange(index, "course", e.target.value)
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-violet-600 focus:outline-none"
                  placeholder="B.Tech Computer Science"
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Duration <span className="text-red-500">*</span>
                </label>
                {/* {console.log(course,"hdhd")} */}
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={
                      userIdprop ? course.duration || "" : course.duration || ""
                    }
                    onChange={(e) => handleDurationChange(index, e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-violet-600 focus:outline-none"
                    placeholder="4"
                    min="1"
                    required
                  />
                  <select
                    value={course.durationUnit || "Years"}
                    onChange={(e) =>
                      handleDurationUnitChange(index, e.target.value)
                    }
                    className="p-2 border rounded focus:ring-2 focus:ring-violet-600 focus:outline-none"
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
                    className="w-full p-2 pl-8 border rounded focus:ring-2 focus:ring-violet-600 focus:outline-none"
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
                ref={minFeeRef}
                className="w-full p-2 pl-8 border rounded bg-gray-100 text-gray-700"
                placeholder="No valid fees"
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
                value={formData.maxFee || "No valid fees"}
                className="w-full p-2 pl-8 border rounded bg-gray-100 text-gray-700"
                placeholder="No valid fees"
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
