import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const FacultySection = ({
  formData,
  handleArrayChange,
  setFormData
}) => {
  // Function to add a new faculty item
  const handleAddFaculty = () => {
    setFormData({
      ...formData,
      faculty: [...formData.faculty, ""]
    });
  };

  // Function to remove a faculty item
  const handleRemoveFaculty = (index) => {
    const updatedFaculty = [...formData.faculty];
    updatedFaculty.splice(index, 1);
    setFormData({
      ...formData,
      faculty: updatedFaculty
    });
  };

  // Quill modules configuration
  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      [{ header: [1, 2, 3, false] }],
    ],
  };

  // Function to handle ReactQuill changes for faculty items
  const handleQuillChange = (content, index) => {
    const updatedFaculty = [...formData.faculty];
    updatedFaculty[index] = content;
    setFormData({
      ...formData,
      faculty: updatedFaculty
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md" id="faculty-information">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl font-semibold">Faculty Information</h2>
        <button
          type="button"
          onClick={handleAddFaculty}
          className="px-3 py-1 bg-[#155DFC] text-white rounded hover:bg-[#155DFC] text-sm transition duration-200 ease-in-out"
        >
          Add Faculty
        </button>
      </div>

      {formData.faculty.map((item, index) => (
        <div key={index} className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="font-medium text-gray-700">Faculty Info {index + 1}*</label>
            {formData.faculty.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveFaculty(index)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm transition duration-200 ease-in-out"
              >
                Remove
              </button>
            )}
          </div>
          
          <ReactQuill
            theme="snow"
            value={item}
            onChange={(content) => handleQuillChange(content, index)}
            modules={quillModules}
            className="bg-white"
            placeholder="Enter faculty information"
            
          />
        </div>
      ))}

      {formData.faculty.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No faculty information added yet. Click "Add Faculty" to begin.</p>
        </div>
      )}
    </div>
  );
};

export default FacultySection;