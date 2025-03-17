import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Make sure to import the styles

const PlacementSection = ({
  formData,
  setFormData,
  handleNestedArrayChange,
  uploadProgress,
  handleAddCompany,
  handleRemoveCompany,
  handleDeepNestedChange,
  handleMultipleFileUpload,
  handleRemoveImage
}) => {
  // Quill modules and formats configuration for consistency
  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      [{ header: [1, 2, 3, false] }],
    ],
  };

  // Function to handle ReactQuill changes for nested objects
  const handleQuillChange = (content, section, subsection = null) => {
    if (subsection) {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [subsection]: {
            ...formData[section][subsection],
            description: content
          }
        }
      });
    } else {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          description: content,
        },
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md" id="placement-information">
      <h2 className="text-3xl font-bold mb-6 text-purple-600 border-b pb-2"
      >
        Placement Information
      </h2>

      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">Description*</label>
        <ReactQuill
          theme="snow"
          value={formData.placement.description}
          onChange={(content) => handleQuillChange(content, "placement")}
          modules={quillModules}
          className="bg-white"
          placeholder="Enter placement description"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700">Placement Rate*</label>
          <input
            type="text"
            name="placementRate"
            value={formData.placement.stats.placementRate}
            onChange={(e) => handleDeepNestedChange(e, "placement", "stats")}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-violet-600"
            placeholder="e.g., 95%"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700">Highest Package*</label>
          <input
            type="text"
            name="highestPackage"
            value={formData.placement.stats.highestPackage}
            onChange={(e) => handleDeepNestedChange(e, "placement", "stats")}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-violet-600"
            placeholder="e.g., ₹10 LPA"
            required
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Top Companies*</h3>
          <button
            type="button"
            onClick={handleAddCompany}
            className="px-3 py-1 bg-violet-600 text-white rounded hover:bg-violet-600 text-sm transition duration-200 ease-in-out"
          >
            Add Company
          </button>
        </div>

        {formData.placement.topCompanies.map((company, index) => (
          <div key={index} className="mb-4 flex items-start gap-2">
            <div className="flex-grow">
              <label className="block mb-1 text-gray-600">Company {index + 1}*</label>
              <input
                type="text"
                value={company}
                onChange={(e) =>
                  handleNestedArrayChange(
                    index,
                    e.target.value,
                    "placement",
                    "topCompanies"
                  )
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300 focus:border-violet-600"
                placeholder="Enter company name"
                required
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveCompany(index)}
              className="mt-7 px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200 ease-in-out"
              disabled={formData.placement.topCompanies.length <= 1}
            >
              <span className="sr-only">Remove</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <h3 className="font-medium mt-8 mb-3">Company Logos*</h3>
      <div className="mb-6 p-4 border border-dashed rounded-lg bg-gray-50">
        <label className="block mb-3 font-medium text-gray-700">Upload Multiple Company Logos</label>
        <div className="flex flex-col items-center justify-center py-3">
          <input
            type="file"
            multiple
            onChange={(e) => handleMultipleFileUpload(e, "placement.companies")}
            className="w-full p-2 border rounded"
            accept="image/*"
          />
          <p className="text-sm text-gray-500 mt-2">
            Upload company logos in JPG, PNG or GIF format
          </p>
        </div>
        
        {uploadProgress["placement.companies"] > 0 &&
          uploadProgress["placement.companies"] < 100 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Uploading...</span>
                <span>{uploadProgress["placement.companies"]}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-violet-600 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${uploadProgress["placement.companies"]}%`,
                  }}
                ></div>
              </div>
            </div>
          )}
      </div>

      {formData.placement.companies &&
        formData.placement.companies.length > 0 && (
          <div className="mt-4 mb-6">
            <h3 className="font-medium mb-3">
              Uploaded Company Logos ({formData.placement.companies.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {formData.placement.companies.map((logo, index) => (
                <div key={index} className="border rounded-lg p-3 bg-white shadow-sm relative group transition-all duration-200 hover:shadow-md">
                  <img
                    src={logo}
                    alt={`Company ${index + 1}`}
                    className="w-full h-16 object-contain rounded"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveImage(index, "placement", "companies")
                    }
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default PlacementSection;