import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ApproveComponent = ({
  setViewMode,
  processingAction,
  selectedCollege,
  actionError,
  approvalNotes,
  setApprovalNotes,
  handleApprove
}) => {
  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"]
    ]
  };

  // Quill formats configuration
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link"
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-2xl mx-auto pt-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Approve Course</h2>
        <button
          onClick={() => setViewMode("list")}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          disabled={processingAction}
        >
          Cancel
        </button>
      </div>

      <div className="mb-4 p-3 bg-gray-100 rounded-md">
        <h3 className="font-semibold mb-1">Course Name:</h3>
        <div>{selectedCollege.courseTitle}</div>
      </div>

      {actionError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {actionError}
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Approval Notes (Optional)
        </label>
        <div className="quill-container">
          <ReactQuill
            theme="snow"
            value={approvalNotes}
            onChange={setApprovalNotes}
            modules={modules}
            formats={formats}
            disabled={processingAction}
            className="bg-white rounded-md"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setViewMode("list")}
          disabled={processingAction}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            /* Your approve function here */
            setViewMode("list");
            handleApprove()
          }}
          disabled={processingAction}
          className="px-4 py-2 bg-[#155DFC] text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#155DFC]"
        >
          {processingAction ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Approve Course"
          )}
        </button>
      </div>
    </div>
  );
};

export default ApproveComponent;