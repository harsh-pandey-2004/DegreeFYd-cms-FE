// components/AdmissionProcessSection.js
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AdmissionProcessSection = ({
  formData,
  handleNestedChange,
  handleNestedArrayChange,
  addAdmissionStep,
  removeAdmissionStep,
}) => {
  // Handle Quill editor changes
  const handleQuillChange = (content) => {
    handleNestedChange({
      target: {
        name: "description",
        value: content
      }
    }, "admissionProcess");
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"]
    ]
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md" id="admission-process">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-violet-600">
        Admission Process
      </h2>

      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Description <span className="text-red-500">*</span>
        </label>
        <div className=" rounded">
          <ReactQuill
            value={formData.admissionProcess.description}
            onChange={handleQuillChange}
            modules={quillModules}
            placeholder="Enter admission process description"
            className=""
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg mb-2 text-violet-600">Admission Steps</h3>
          <button
            type="button"
            onClick={addAdmissionStep}
            className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-600 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Step
          </button>
        </div>
      </div>

      {formData.admissionProcess.steps.map((step, index) => (
        <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-3">
            <label className="font-medium text-violet-600">
              Step {index + 1} <span className="text-red-500">*</span>
            </label>
            {formData.admissionProcess.steps.length > 1 && (
              <button
                type="button"
                onClick={() => removeAdmissionStep(index)}
                className="text-red-500 hover:text-red-700 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Remove
              </button>
            )}
          </div>
          <div className="relative">
            <span className="absolute top-3 left-3 flex items-center justify-center h-5 w-5 bg-violet-600 text-white rounded-full text-xs">
              {index + 1}
            </span>
            <input
              type="text"
              value={step}
              onChange={(e) =>
                handleNestedArrayChange(
                  index,
                  e.target.value,
                  "admissionProcess",
                  "steps"
                )
              }
              className="w-full p-2 pl-10 border rounded focus:ring-2 focus:ring-violet-600 focus:outline-none"
              placeholder="Describe this admission step"
              required
            />
          </div>
        </div>
      ))}

      {formData.admissionProcess.steps.length === 0 && (
        <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg mb-4">
          <p className="text-gray-500">No admission steps added yet. Click "Add Step" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default AdmissionProcessSection;