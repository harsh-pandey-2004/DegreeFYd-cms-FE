// components/ApprovalRankingSection.js
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ApprovalRankingSection = ({ formData, handleNestedChange }) => {
  // Handle Quill editor changes
  const handleQuillChange = (content) => {
    handleNestedChange({
      target: {
        name: "description",
        value: content
      }
    }, "approvalAndRanking");
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
    <div className="bg-white p-6 rounded-lg shadow-md" id="approval-and-ranking">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-blue-700">
        Approval And Ranking
      </h2>

      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Description <span className="text-red-500">*</span>
        </label>
        <div className="">
          <ReactQuill
            value={formData.approvalAndRanking.description}
            onChange={handleQuillChange}
            modules={quillModules}
            placeholder="Enter approval and ranking details (e.g., UGC, AICTE, NAAC, NIRF, etc.)"
            className=""
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Include information about accreditation bodies, ranking positions, and any special recognitions.
        </p>
      </div>
    </div>
  );
};

export default ApprovalRankingSection;