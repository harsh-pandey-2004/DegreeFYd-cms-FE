// components/OverviewSection.js
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const OverviewSection = ({
  formData,
  handleArrayChange,
  addOverviewPoint,
  removeOverviewPoint,
  errors,
  setErrors
}) => {
  // Track quill errors for each overview point
  const [quillErrors, setQuillErrors] = useState(
    Array(formData.overview.length).fill(false)
  );

  // Validate quill content - check if it's empty or just contains empty tags/whitespace
  const validateQuillContent = (content) => {
    if (!content || content.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
      return false;
    }
    return true;
  };

  // Handle quill change with validation
  const handleQuillChange = (index, content) => {
    // Update the content
    handleArrayChange(index, content, "overview");
    
   
    
    // Update parent errors if needed
    if (errors && errors.overview && errors.overview[index] && isValid) {
      const newErrors = {...errors};
      if (newErrors.overview) {
        newErrors.overview[index] = null;
        if (newErrors.overview.every(err => err === null)) {
          delete newErrors.overview;
        }
        setErrors(newErrors);
      }
    }
  };

  // Add new overview point with error tracking
  const handleAddOverviewPoint = () => {
    addOverviewPoint();
    setQuillErrors([...quillErrors, false]);
  };

  // Remove overview point with error tracking
  const handleRemoveOverviewPoint = (index) => {
    removeOverviewPoint(index);
    const newQuillErrors = [...quillErrors];
    newQuillErrors.splice(index, 1);
    setQuillErrors(newQuillErrors);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 my-6" id="overview">
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h2 className="text-3xl font-bold mb-6 text-purple-600  pb-2">Overview</h2>
        <button
          type="button"
          onClick={handleAddOverviewPoint}
          className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-600 transition-colors duration-300 flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-1" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Overview Point
        </button>
      </div>

      {formData.overview.length === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-lg  border-dashed border-gray-300">
          <p className="text-gray-500">No overview points added yet. Click the button above to add one.</p>
        </div>
      )}

      {formData.overview.map((item, index) => (
        <div 
          key={index} 
          className="mb-6 p-4  rounded-lg bg-gray-50 hover:shadow-md transition-all duration-200"
        >
          <div className="flex justify-between items-center mb-3">
            <label className="font-semibold text-gray-700 text-lg">
              Overview Point {index + 1}*
            </label>
            {formData.overview.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveOverviewPoint(index)}
                className="bg-red-100 text-red-600 px-3 py-1 rounded-md hover:bg-red-200 transition-colors duration-200 flex items-center"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-1" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Remove
              </button>
            )}
          </div>

          <div className={`${quillErrors[index] || (errors?.overview && errors.overview[index]) ? 'border-2 border-red-500 rounded-md' : ''}`}>
            <ReactQuill
              theme="snow"
              value={item}
              onChange={(content) => handleQuillChange(index, content)}
              modules={{
                toolbar: [
                  [{ 'font': [] }],
                  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  ['blockquote', 'code-block'],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'script': 'sub'}, { 'script': 'super' }],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'indent': '-1'}, { 'indent': '+1' }],
                  [{ 'direction': 'rtl' }],
                  [{ 'align': [] }],
                  ['link', 'image', 'video'],
                  ['clean']
                ]
              }}
              className="bg-white rounded-md"
              style={{ minHeight: '200px' }}
            />
          </div>
          
          {(quillErrors[index] || (errors?.overview && errors.overview[index])) && (
            <p className="text-red-500 text-sm mt-1">Overview content is required</p>
          )}
          
          <p className="text-sm text-gray-500 mt-2">
            Provide important information about this aspect of your college.
          </p>
        </div>
      ))}
    </div>
  );
};

export default OverviewSection;