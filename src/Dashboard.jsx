import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Edit,
  Eye,
  Check,
  X,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  XCircle,
  Trash,
} from "lucide-react";
import { CollegeForm } from "./CRM";
import { useNavigate } from "react-router-dom";
import ApproveComponent from "./components/ApproveComponent";
import RejectComponent from "./components/RejectComponent";
import DOMPurify from "dompurify";

const Dashboard = () => {
  const [responses, setResponses] = useState([]);
  const [filteredResponses, setFilteredResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEdit, setopenEdit] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // 'list', 'preview', 'approve', or 'reject'
  const [previewCollege, setPreviewCollege] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingAction, setProcessingAction] = useState(false);
  const [actionError, setActionError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "collegeName",
    direction: "ascending",
  });
  const [filters, setFilters] = useState({
    status: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [userEmails, setUserEmails] = useState({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Rejection reason popup states
  const [showReasonPopup, setShowReasonPopup] = useState(false);
  const [popupReason, setPopupReason] = useState("");
  const [popupCollegeName, setPopupCollegeName] = useState("");

  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const isContentCreator = userRole === "content-creator";
  const canApprove =
    userRole !== "content-creator" ||
    (localStorage.getItem("permissions") || "").includes("approveColleges");

  const fetchColleges = async () => {
    try {
      let response;
      if (isContentCreator) {
        response = await axios.get(
          `https://degreefydcmsbe.onrender.com/api/colleges/userId/${userId}`
        );
      } else {
        response = await axios.get(
          "https://degreefydcmsbe.onrender.com/api/colleges"
        );
      }
      setResponses(response.data);
      setFilteredResponses(response.data);
      setLoading(false);

      // Collect all unique user IDs that need email lookups
      const userIds = new Set();
      response.data.forEach((college) => {
        if (college.createdBy) userIds.add(college.createdBy);
        if (college.approvedBy) userIds.add(college.approvedBy);
      });

      // Fetch emails for all users in one go
      fetchUserEmails(Array.from(userIds));
    } catch (error) {
      console.error("Error fetching colleges:", error);
      setLoading(false);
    }
  };

  const fetchUserEmails = async (userIds) => {
    const emailMap = { ...userEmails };

    for (const id of userIds) {
      if (!emailMap[id]) {
        try {
          const response = await axios.get(
            `https://degreefydcmsbe.onrender.com/api/auth/user/${id}`
          );
          emailMap[id] = response?.data.data.email;
        } catch (error) {
          console.error(`Error fetching email for user ${id}:`, error);
          emailMap[id] = "N/A";
        }
      }
    }

    setUserEmails(emailMap);
  };

  // Get email from cache
  const getUserEmail = (userId) => {
    return userEmails[userId] || "N/A";
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  // Apply search, sort, and filters whenever they change
  useEffect(() => {
    let result = [...responses];

    // Apply filters
    if (filters.status !== "all") {
      result = result.filter((college) => college.status === filters.status);
    }

    // Apply search
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (college) =>
          college.collegeName.toLowerCase().includes(lowerCaseSearchTerm) ||
          (college.createdBy &&
            userEmails[college.createdBy]
              ?.toLowerCase()
              .includes(lowerCaseSearchTerm)) ||
          (college.approvedBy &&
            userEmails[college.approvedBy]
              ?.toLowerCase()
              .includes(lowerCaseSearchTerm)) ||
          (college.status &&
            college.status.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (!a[sortConfig.key] && !b[sortConfig.key]) return 0;
        if (!a[sortConfig.key]) return 1;
        if (!b[sortConfig.key]) return -1;

        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle dates
        if (sortConfig.key.includes("date") || sortConfig.key.includes("At")) {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredResponses(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [responses, searchTerm, sortConfig, filters, userEmails]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handlePreview = (college) => {
    const collegeName = encodeURIComponent(college.collegeName); // Ensure the name is URL-safe
    const url = `https://degreefydce.netlify.app/college/${collegeName}?istest=true`;
    window.open(url, "_blank"); // Open in a new tab
  };

  const handleDelete = async (collegeData) => {
    console.log(collegeData._id);
    try {
      const response = await axios.delete(
        `https://degreefydcmsbe.onrender.com/api/colleges/${collegeData._id}`
      );
      window.location.reload();
      console.log(response.data);
      // fetchColleges();
    } catch (error) {
      console;
    }
  };
  const openApproveForm = (college) => {
    setSelectedCollege(college);
    setApprovalNotes("");
    setActionError("");
    setViewMode("approve");
  };

  const openRejectForm = (college) => {
    setSelectedCollege(college);
    setRejectionReason("");
    setActionError("");
    setViewMode("reject");
  };

  // Open rejection reason popup
  const openRejectionReason = (reason, collegeName) => {
    setPopupReason(reason);
    setPopupCollegeName(collegeName);
    setShowReasonPopup(true);

    // Configure DOMPurify to allow list elements
    DOMPurify.addHook("afterSanitizeAttributes", function (node) {
      // Fix display issues for list elements by adding style
      if (node.nodeName === "UL" || node.nodeName === "OL") {
        node.setAttribute(
          "style",
          "display: block; list-style-type: disc; padding-left: 40px; margin: 1em 0;"
        );
      }
      if (node.nodeName === "LI") {
        node.setAttribute("style", "display: list-item;");
      }
    });
  };

  // Close rejection reason popup
  const closeRejectionPopup = () => {
    setShowReasonPopup(false);
  };

  const handleApprove = async () => {
    if (!selectedCollege) return;

    setProcessingAction(true);
    setActionError("");

    try {
      const response = await axios.put(
        `https://degreefydcmsbe.onrender.com/api/colleges/approve/${selectedCollege._id}`,
        {
          userId: userId,
          status: "approved",
          notes: approvalNotes,
        }
      );

      // Update the college status in the local state
      setResponses(
        responses.map((college) =>
          college._id === selectedCollege._id ? response.data : college
        )
      );

      setViewMode("list");
    } catch (error) {
      console.error("Error approving college:", error);
      setActionError(
        error.response?.data?.message ||
          "Failed to approve college. Please try again."
      );
    } finally {
      setProcessingAction(false);
    }
  };

  const handleReject = async () => {
    if (!selectedCollege || !rejectionReason.trim()) return;

    setProcessingAction(true);
    setActionError("");

    try {
      const response = await axios.put(
        `https://degreefydcmsbe.onrender.com/api/colleges/approve/${selectedCollege._id}`,
        {
          userId: userId,
          status: "rejected",
          notes: rejectionReason,
        }
      );

      // Update the college status in the local state
      setResponses(
        responses.map((college) =>
          college._id === selectedCollege._id ? response.data : college
        )
      );

      setViewMode("list");
    } catch (error) {
      console.error("Error rejecting college:", error);
      setActionError(
        error.response?.data?.message ||
          "Failed to reject college. Please try again."
      );
    } finally {
      setProcessingAction(false);
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown size={14} className="ml-1" />;
    }

    return sortConfig.direction === "ascending" ? (
      <ChevronUp size={14} className="ml-1" />
    ) : (
      <ChevronDown size={14} className="ml-1" />
    );
  };

  // New tooltip component for truncated text
  const TooltipCell = ({ text, maxWidth }) => {
    if (!text || text === "N/A") return <span>N/A</span>;

    return (
      <div className="relative group">
        <div className="truncate" style={{ maxWidth: maxWidth || "200px" }}>
          {text}
        </div>
       
      </div>
    );
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResponses.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredResponses.length / itemsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 h-screen bg-gray-50">
        <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="mt-4 text-gray-700 font-medium">
            Loading colleges data...
          </span>
        </div>
      </div>
    );
  }

  // Approval form
  if (viewMode === "approve" && selectedCollege) {
    return (
      <ApproveComponent
        setViewMode={setViewMode}
        processingAction={processingAction}
        selectedCollege={selectedCollege}
        actionError={actionError}
        approvalNotes={approvalNotes}
        setApprovalNotes={setApprovalNotes}
        handleApprove={handleApprove}
      />
    );
  }

  // Rejection form
  if (viewMode === "reject" && selectedCollege) {
    return (
      <RejectComponent
        setViewMode={setViewMode}
        processingAction={processingAction}
        selectedCollege={selectedCollege}
        actionError={actionError}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        handleReject={handleReject}
      />
    );
  }

  return (
    <div className="w-full p-4 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          College Dashboard
        </h1>

        {/* Rejection Reason Popup */}
        {showReasonPopup && (
          <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white">
                <h3 className="text-lg font-medium">
                  Rejection Reason for {popupCollegeName}
                </h3>
                <button
                  onClick={closeRejectionPopup}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>
              <div className="p-6 max-h-96 overflow-y-auto prose">
                {popupReason ? (
                  <div
                    className="rejection-reason-content"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(popupReason, {
                        USE_PROFILES: { html: true },
                        ADD_ATTR: ["style"],
                        ADD_TAGS: ["ul", "ol", "li"],
                      }),
                    }}
                  />
                ) : (
                  <p className="text-gray-500 italic">No reason provided</p>
                )}
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
                <button
                  onClick={closeRejectionPopup}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {openEdit ? (
          <div>
            <button
              onClick={() => setopenEdit(false)}
              className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Back to List
            </button>
            <CollegeForm userIdprop={selectedCollege} />
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
            <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    College List
                  </h2>
                  <p className="text-sm text-gray-600">
                    {filteredResponses.length}{" "}
                    {filteredResponses.length === 1 ? "college" : "colleges"}{" "}
                    found
                  </p>
                </div>

                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
                  {/* Search input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search colleges..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    />
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                  </div>

                  {/* Filter button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="px-4 py-2 border border-gray-300 rounded-md flex items-center space-x-2 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Filter size={16} />
                      <span>Filters</span>
                      {showFilters ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>

                    {/* Filter options */}
                    {showFilters && (
                      <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-4 w-64">
                        <h3 className="font-medium text-gray-700 mb-3">
                          Filter by Status
                        </h3>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              checked={filters.status === "all"}
                              onChange={() =>
                                setFilters({ ...filters, status: "all" })
                              }
                              className="form-radio text-blue-600"
                            />
                            <span>All</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              checked={filters.status === "approved"}
                              onChange={() =>
                                setFilters({ ...filters, status: "approved" })
                              }
                              className="form-radio text-blue-600"
                            />
                            <span>Approved</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              checked={filters.status === "pending"}
                              onChange={() =>
                                setFilters({ ...filters, status: "pending" })
                              }
                              className="form-radio text-blue-600"
                            />
                            <span>Pending</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="status"
                              checked={filters.status === "rejected"}
                              onChange={() =>
                                setFilters({ ...filters, status: "rejected" })
                              }
                              className="form-radio text-blue-600"
                            />
                            <span>Rejected</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Items per page selector */}
                  <div className="relative">
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="pl-3 pr-8 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={5}>5 per page</option>
                      <option value={10}>10 per page</option>
                      <option value={15}>15 per page</option>
                      <option value={20}>20 per page</option>
                      <option value={50}>50 per page</option>
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>

                  {/* Refresh button */}
                  <button
                    onClick={() => fetchColleges()}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto" style={{ maxHeight: "70vh" }}>
              <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50 sticky top-0 z-10">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-40 min-w-[10rem]"
                      onClick={() => handleSort("collegeName")}
                    >
                      <div className="flex items-center">
                        College Name
                        {getSortIcon("collegeName")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-32 min-w-[8rem]"
                      onClick={() => handleSort("createdBy")}
                    >
                      <div className="flex items-center">
                        Created By
                        {getSortIcon("createdBy")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-32 min-w-[8rem]"
                      onClick={() => handleSort("approvedBy")}
                    >
                      <div className="flex items-center">
                        Checked By
                        {getSortIcon("approvedBy")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-32 min-w-[8rem]"
                      onClick={() => handleSort("approvalDate")}
                    >
                      <div className="flex items-center text-nowrap">
                        Approved At
                        {getSortIcon("approvalDate")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-32 min-w-[8rem]"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center">
                        Created At
                        {getSortIcon("createdAt")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40 min-w-[10rem]"
                    >
                      Rejected Reason
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-24 min-w-[6rem]"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Status
                        {getSortIcon("status")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-32 min-w-[8rem]"
                      onClick={() => handleSort("updatedAt")}
                    >
                      <div className="flex items-center text-nowrap">
                        Updated On
                        {getSortIcon("updatedAt")}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28 min-w-[7rem]"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan="9"
                        className="px-6 py-10 text-center text-sm text-gray-500"
                      >
                        {searchTerm || filters.status !== "all"
                          ? "No colleges found matching your criteria"
                          : "No colleges found"}
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((college, index) => (
                      <tr
                        key={college._id}
                        className={`hover:bg-blue-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <TooltipCell
                            text={college.collegeName}
                            maxWidth="200px"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <TooltipCell
                            text={getUserEmail(college.createdBy)}
                            maxWidth="150px"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <TooltipCell
                            text={getUserEmail(college.approvedBy)}
                            maxWidth="150px"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(college.approvalDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(college.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {college.rejectionReason ? (
                            <button
                              onClick={() =>
                                openRejectionReason(
                                  college.rejectionReason,
                                  college.collegeName
                                )
                              }
                              className="text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                            >
                              View Reason
                            </button>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              college.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : college.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {college.status
                              ? college.status.charAt(0).toUpperCase() +
                                college.status.slice(1)
                              : "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(college.updatedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            {/* Edit button - available to all */}
                            <button
                              className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors tooltip shadow-sm border border-gray-100"
                              title="Edit"
                              onClick={() => {
                                setopenEdit(true);
                                setSelectedCollege(college._id);
                              }}
                            >
                              <Edit size={16} />
                            </button>

                            {/* Preview button - available to all */}
                            <button
                              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors tooltip shadow-sm border border-gray-100"
                              title="Preview"
                              onClick={() => handlePreview(college)}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors tooltip shadow-sm border border-gray-100"
                              title="Delete"
                              onClick={() => handleDelete(college)}
                            >
                              <Trash size={16} />
                            </button>

                            {/* Approve button - only for admin/users with permission */}
                            {canApprove && college.status === "pending" && (
                              <button
                                className="p-1.5 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-full transition-colors tooltip shadow-sm border border-gray-100"
                                title="Approve"
                                onClick={() => openApproveForm(college)}
                              >
                                <Check size={16} />
                              </button>
                            )}

                            {/* Reject button - only for admin/users with permission */}
                            {canApprove && college.status === "pending" && (
                              <button
                                className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors tooltip shadow-sm border border-gray-100"
                                title="Reject"
                                onClick={() => openRejectForm(college)}
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination controls */}
            {filteredResponses.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredResponses.length)} of{" "}
                  {filteredResponses.length} entries
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Logic to show pages around current page
                    let pageToShow;
                    if (totalPages <= 5) {
                      pageToShow = i + 1;
                    } else if (currentPage <= 3) {
                      pageToShow = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageToShow = totalPages - 4 + i;
                    } else {
                      pageToShow = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageToShow}
                        onClick={() => goToPage(pageToShow)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === pageToShow
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                        }`}
                      >
                        {pageToShow}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    }`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
