// components/CertificatesSection.js
import React, { useRef } from "react";

const CertificatesSection = ({
  formData,
  handleMultipleFileUpload1,
  uploadProgress,
  handleRemoveImage1,
}) => {
  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md" id="accreditations">
      <h2 className="text-3xl font-bold mb-6 text-purple-600 border-b pb-2">
        Accredations & Approvals
      </h2>

      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Approved By <span className="text-red-500">*</span>
        </label>
        
        <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="mb-2 text-sm text-gray-700">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          
          <input
  ref={fileInputRef}
  type="file"
  name="certificatesInput" // Add this line
  onChange={(e) => handleMultipleFileUpload1(e, "certificates")}
  className="hidden"
  multiple
  accept="image/*"
/>
          
          <button
            type="button"
            onClick={triggerFileInput}
            className="mt-4 px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600"
          >
            Select Files
          </button>
        </div>

        {uploadProgress["certificates"] > 0 && uploadProgress["certificates"] < 100 && (
          <div className="mb-4">
            <div className="flex justify-between mb-1 text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress["certificates"]}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-violet-600 h-2.5 rounded-full transition-all duration-300"
                style={{
                  width: `${uploadProgress["certificates"]}%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {formData.certificates && formData.certificates.length > 0 ? (
          <div className="mt-4">
            <h3 className="font-medium mb-3 text-violet-600">
              Uploaded Certificates ({formData.certificates.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {formData.certificates.map((logo, index) => (
                <div key={index} className="border p-3 rounded-lg shadow-sm bg-white relative group hover:shadow-md transition-shadow">
                  <img
                    src={logo}
                    alt={`Certificate ${index + 1}`}
                    className="w-full h-24 object-contain rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage1(index, "certificates")}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                    title="Remove certificate"
                  >
                    ×
                  </button>
                  <p className="text-xs text-center mt-2 text-gray-500 truncate">
                    Certificate {index + 1}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            No certificates uploaded yet. Please upload images of approvals, accreditations, or certificates.
          </p>
        )}
      </div>
    </div>
  );
};

export default CertificatesSection;