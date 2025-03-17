// components/BasicInfoSection.js
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BasicInfoSection = ({
  formData,
  handleChange,
  handleSingleFileUpload,
  uploadProgress,
  setFormData,
  errors,
 
}) => {
  const [quillError, setQuillError] = useState(false);
  // Handle quill change with validation
  const handleQuillChange = (content) => {
    

    setFormData({
      ...formData,
      aboutUsSub: content,
    });
  };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
      id="basic-info"
    >
      <h2 className="text-3xl font-bold mb-6 text-purple-600 border-b pb-2">
        Basic Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="transition-all duration-200 hover:shadow-md p-3 rounded-md">
          <label className="block mb-2 font-semibold text-gray-700">
            College Name*
          </label>
          <input
            type="text"
            name="collegeName"
            value={formData.collegeName}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 ${
              errors?.collegeName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter college name"
            required
          />
          {errors?.collegeName && (
            <p className="text-red-500 text-sm mt-1">{errors.collegeName}</p>
          )}
        </div>
        <div className="transition-all duration-200 hover:shadow-md p-3 rounded-md">
          <label className="block mb-2 font-semibold text-gray-700">
            NIRF Ranking*
          </label>
          <input
            type="number"
            name="nirfranking"
            value={formData.nirfranking}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 ${
              errors?.collegeName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter number (e.g., 42)"
            required
          />
          {errors?.nirfranking && (
            <p className="text-red-500 text-sm mt-1">{errors.nirfranking}</p>
          )}
        </div>
        <div className="transition-all duration-200 hover:shadow-md p-3 rounded-md">
          <label className="block mb-2 font-semibold text-gray-700">
            Students Enrolled*
          </label>
          <input
            type="number"
            name="students"
            value={formData.students}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 ${
              errors?.students ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter number (e.g., 5000)"
            required
          />
          {errors?.students && (
            <p className="text-red-500 text-sm mt-1">{errors.students}</p>
          )}
        </div>

        {/* //////// */}
        <div className="transition-all duration-200 hover:shadow-md p-3 rounded-md">
          <label className="block mb-2 font-semibold text-gray-700">
            Location*
          </label>
          <input
            type="text"
            name="collegeLocation"
            value={formData.collegeLocation}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 ${
              errors?.collegeLocation ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="City, State (e.g., Mumbai, Maharashtra)"
            required
          />
          {errors?.collegeLocation && (
            <p className="text-red-500 text-sm mt-1">
              {errors.collegeLocation}
            </p>
          )}
        </div>

        <div className="transition-all duration-200 hover:shadow-md p-3 rounded-md">
          <label className="block mb-2 font-semibold text-gray-700">
            Established Year*
          </label>
          <input
            type="number"
            name="established"
            value={formData.established}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 ${
              errors?.established ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter year (e.g., 1985)"
            required
          />
          {errors?.established && (
            <p className="text-red-500 text-sm mt-1">{errors.established}</p>
          )}
        </div>

        <div className="transition-all duration-200 hover:shadow-md p-3 rounded-md">
          <label className="block mb-2 font-semibold text-gray-700">
            Highest Package*
          </label>
          <input
            type="text"
            name="highestPackage"
            value={formData.highestPackage}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 ${
              errors?.highestPackage ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., 13 Lakh"
            required
          />
          {errors?.highestPackage && (
            <p className="text-red-500 text-sm mt-1">{errors.highestPackage}</p>
          )}
        </div>

        <div className="transition-all duration-200 hover:shadow-md p-3 rounded-md">
          <label className="block mb-2 font-semibold text-gray-700">
            Average Package*
          </label>
          <input
            type="text"
            name="averagePackage"
            value={formData.averagePackage}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 ${
              errors?.averagePackage ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., 8 Lakh"
            required
          />
          {errors?.averagePackage && (
            <p className="text-red-500 text-sm mt-1">{errors.averagePackage}</p>
          )}
        </div>

        <div className="transition-all duration-200 hover:shadow-md p-3 rounded-md">
          <label className="block mb-2 font-semibold text-gray-700">
            College Logo*
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-indigo-400 transition-colors duration-200">
            <input
              type="file"
              onChange={(e) => handleSingleFileUpload(e, "collegeLogo")}
              className="w-full"
              required={!formData.collegeLogo}
            />
            <p className="text-sm text-gray-500 mt-2">
              Drag and drop a file or click to browse
            </p>
          </div>

          {uploadProgress.collegeLogo > 0 &&
            uploadProgress.collegeLogo < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                <div
                  className="bg-violet-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.collegeLogo}%` }}
                ></div>
                <p className="text-xs text-gray-600 text-right mt-1">
                  {uploadProgress.collegeLogo}%
                </p>
              </div>
            )}

          {formData.collegeLogo && (
            <div className="mt-3 p-2 border rounded-md bg-gray-50">
              <p className="text-sm text-gray-600 mb-1">Uploaded Logo:</p>
              <img
                src={formData.collegeLogo}
                alt="College Logo"
                className="h-20 mx-auto rounded-md shadow-sm"
              />
            </div>
          )}

          {errors?.collegeLogo && (
            <p className="text-red-500 text-sm mt-1">{errors.collegeLogo}</p>
          )}
        </div>

        <div className="transition-all duration-200 hover:shadow-md p-3 rounded-md">
          <label className="block mb-2 font-semibold text-gray-700">
            College Image*
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-indigo-400 transition-colors duration-200">
            <input
              type="file"
              onChange={(e) => handleSingleFileUpload(e, "collegeImage")}
              className="w-full"
              required={!formData.collegeImage}
            />
            <p className="text-sm text-gray-500 mt-2">
              Drag and drop a file or click to browse
            </p>
          </div>

          {uploadProgress.collegeImage > 0 &&
            uploadProgress.collegeImage < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                <div
                  className="bg-violet-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.collegeImage}%` }}
                ></div>
                <p className="text-xs text-gray-600 text-right mt-1">
                  {uploadProgress.collegeImage}%
                </p>
              </div>
            )}

          {formData.collegeImage && (
            <div className="mt-3 p-2 border rounded-md bg-gray-50">
              <p className="text-sm text-gray-600 mb-1">Uploaded Image:</p>
              <img
                src={formData.collegeImage}
                alt="College Image"
                className="h-20 mx-auto rounded-md shadow-sm"
              />
            </div>
          )}

          {errors?.collegeImage && (
            <p className="text-red-500 text-sm mt-1">{errors.collegeImage}</p>
          )}
        </div>

        <div className="col-span-2 transition-all duration-200 hover:shadow-md p-4 rounded-lg ">
          <label className="block mb-2 font-semibold text-gray-700">
            About Us*
          </label>
          <div>
            <ReactQuill
              theme="snow"
              value={formData.aboutUsSub}
              onChange={handleQuillChange}
              modules={{
                toolbar: [
                  [{ font: [] }],
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  ["bold", "italic", "underline", "strike"],
                  ["blockquote", "code-block"],
                  [{ color: [] }, { background: [] }],
                  [{ script: "sub" }, { script: "super" }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  [{ indent: "-1" }, { indent: "+1" }],
                  [{ direction: "rtl" }],
                  [{ align: [] }],
                  ["link", "image", "video"],
                  ["clean"],
                ],
              }}
              className="bg-white rounded-md"
              style={{ minHeight: "250px" }}
            />
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Provide detailed information about your college or institution.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
