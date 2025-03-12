import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const RejectComponent = ({
  setViewMode,
  processingAction,
  selectedCollege,
  actionError,
  rejectionReason,
  setRejectionReason,
  handleReject,
}) => {
  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
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
    "link",
  ];

  // Check if rejection reason is empty (handling HTML content from Quill)
  const isReasonEmpty = () => {
    // This will strip HTML tags and check if the content is empty
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = rejectionReason || "";
    return !tempDiv.textContent.trim();
  };

  return (
    <div className="w-full p-4 bg-gray-50 min-h-screen pt-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Reject College</h1>
          <button
            onClick={() => setViewMode("list")}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            disabled={processingAction}
          >
            Cancel
          </button>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {selectedCollege.collegeName}
          </h2>

          {actionError && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md border border-red-200">
              {actionError}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <div className="quill-container">
              <ReactQuill
                theme="snow"
                value={rejectionReason}
                onChange={setRejectionReason}
                modules={modules}
                formats={formats}
                disabled={processingAction}
                className="bg-white"
                placeholder="Please provide a reason for rejection..."
              />
            </div>
            {isReasonEmpty() && (
              <p className="mt-1 text-sm text-red-500">
                Rejection reason is required
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={() => setViewMode("list")}
              disabled={processingAction}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={handleReject}
              disabled={isReasonEmpty() || processingAction}
            >
              {processingAction ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Processing...
                </span>
              ) : (
                "Reject Collegess"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectComponent;
