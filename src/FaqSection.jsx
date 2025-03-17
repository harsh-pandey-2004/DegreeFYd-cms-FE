import React from "react";

const FaqSection = ({ formData, handleArrayChange }) => {
  const handleQuestionChange = (index, value) => {
    handleArrayChange(index, value, "faq", "question");
  };

  const handleAnswerChange = (index, value) => {
    handleArrayChange(index, value, "faq", "answer");
  };

  const addFaqItem = () => {
    const updatedFaq = [...formData.faq, { question: "", answer: "" }];
    handleArrayChange(null, updatedFaq, "faq");
  };

  const removeFaqItem = (index) => {
    const updatedFaq = formData.faq.filter((_, i) => i !== index);
    handleArrayChange(null, updatedFaq, "faq");
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow" id="faq">
      <h2 className="text-3xl font-bold mb-6 text-[#155DFC] border-b pb-2">Frequently Asked Questions</h2>
      
      {formData.faq.map((faq, index) => (
        <div key={index} className="mb-4 p-3 border border-gray-200 rounded">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question {index + 1}
            </label>
            <input
              type="text"
              value={faq.question}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter FAQ question"
            />
          </div>
          
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Answer
            </label>
            <textarea
              value={faq.answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows="3"
              placeholder="Enter FAQ answer"
            />
          </div>
          
          <button
            type="button"
            onClick={() => removeFaqItem(index)}
            className="text-red-600 hover:text-red-800 border-2 px-4 py-1 rounded"
          >
            Remove FAQ
          </button>
        </div>
      ))}
      
      <button
        type="button"
        onClick={addFaqItem}
        className="mt-2 px-4 py-2 bg-[#155DFC] text-white rounded hover:bg-[#155DFC]"
      >
        Add New FAQ
      </button>
    </div>
  );
};

export default FaqSection;