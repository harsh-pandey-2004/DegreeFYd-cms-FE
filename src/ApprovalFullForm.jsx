import React from "react";

const ApprovalsSection = ({ formData, setFormData }) => {
  if (!setFormData || !formData) {
    console.error("setFormData or formData is missing!");
    return null;
  }

  // Function to handle changes in approval fields
  const handleApprovalChange = (index, key, value) => {
    const updatedApprovals = formData.fullFormOfApprovals.map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );
    setFormData({ ...formData, fullFormOfApprovals: updatedApprovals });
  };

  // Add a new approval entry
  const addApproval = () => {
    setFormData({
      ...formData,
      fullFormOfApprovals: [
        ...formData.fullFormOfApprovals,
        { abbreviation: "", fullForm: "" },
      ],
    });
  };

  // Remove an approval entry
  const removeApproval = (index) => {
    const updatedApprovals = formData.fullFormOfApprovals.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, fullFormOfApprovals: updatedApprovals });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-3xl font-bold mb-6 text-purple-600 border-b pb-2">
        Approvals & Full Forms
      </h2>

      <div className="mb-4 flex justify-between items-center">
        <h3 className="font-medium text-lg text-violet-600">Approvals</h3>
        <button
          type="button"
          onClick={addApproval}
          className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-600 flex items-center"
        >
          Add Approval
        </button>
      </div>

      {formData?.fullFormOfApprovals?.map((approval, index) => (
        <div
          key={index}
          className="mb-4 p-4 border rounded-lg bg-gray-50 hover:shadow-md transition-shadow"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Approval Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={approval.abbreviation}
                onChange={(e) =>
                  handleApprovalChange(index, "abbreviation", e.target.value)
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-violet-600 focus:outline-none"
                placeholder="Enter Approval Name (e.g., UGC)"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Full Form <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={approval.fullForm}
                onChange={(e) =>
                  handleApprovalChange(index, "fullForm", e.target.value)
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-violet-600 focus:outline-none"
                placeholder="Enter Full Form (e.g., University Grants Commission)"
                required
              />
            </div>
          </div>

          {formData?.fullFormOfApprovals.length > 1 && (
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => removeApproval(index)}
                className="text-red-500 hover:text-red-700 flex items-center"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ApprovalsSection;
