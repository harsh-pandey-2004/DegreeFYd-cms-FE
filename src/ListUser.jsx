import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [passwordLoading, setPasswordLoading] = useState(null);
  const [roleLoading, setRoleLoading] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const fetchUsersWithColleges = async () => {
    try {
      // Fetch all users
      const usersResponse = await axios.get(
        "https://degreefydcmsbe.onrender.com/api/auth/user"
      );

      // Extract the user data from the nested structure
      if (!usersResponse.data.success) {
        throw new Error("Failed to fetch users");
      }

      const userData = usersResponse.data.data || [];

      if (userData.length === 0) {
        setUsers([]);
        setLoading(false);
        return;
      }

      // Fetch college data for each user
      const usersWithColleges = await Promise.all(
        userData.map(async (user) => {
          try {
            const collegeResponse = await axios.get(
              `https://degreefydcmsbe.onrender.com/api/colleges/userId/${user._id}`
            );

            // Handle possible nested structure in college response as well
            const colleges =
              collegeResponse.data.data || collegeResponse.data || [];

            // Count approved and rejected colleges
            const approvedCount = colleges.filter(
              (college) => college.status === "approved"
            ).length;
            const rejectedCount = colleges.filter(
              (college) => college.status === "rejected"
            ).length;
            const pendingCount = colleges.filter(
              (college) => college.status === "pending" || !college.status
            ).length;

            return {
              ...user,
              colleges,
              collegeCount: colleges.length,
              approvedCount,
              rejectedCount,
              pendingCount,
            };
          } catch (error) {
            console.error(
              `Error fetching colleges for user ${user._id}:`,
              error
            );
            return {
              ...user,
              colleges: [],
              collegeCount: 0,
              approvedCount: 0,
              rejectedCount: 0,
              pendingCount: 0,
            };
          }
        })
      );

      setUsers(usersWithColleges);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersWithColleges();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    setDeleteLoading(userId);
    try {
      // Call the delete API endpoint
      const response = await axios.delete(
        `https://degreefydcmsbe.onrender.com/api/auth/user/${userId}`
      );

      if (response.data.success) {
        // Remove the deleted user from the state
        setUsers(users.filter((user) => user._id !== userId));
        toast.success("User deleted successfully");
      } else {
        toast.error(
          "Failed to delete user: " + (response.data.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(
        "Failed to delete user: " +
          (error.response?.data?.message || error.message || "Unknown error")
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  const openPasswordModal = (user) => {
    setSelectedUser(user);
    setNewPassword("");
    setPasswordStrength("");
    setShowPassword(false);
    setShowPasswordModal(true);
  };

  const checkPasswordStrength = (password) => {
    if (!password) return "";
    if (password.length < 6) return "Too Short";
    
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    const strength = [hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (strength <= 1) return "Weak";
    if (strength <= 2) return "Medium";
    return "Strong";
  };

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case "Weak": return "text-red-500";
      case "Medium": return "text-yellow-500";
      case "Strong": return "text-[#155DFC]";
      case "Too Short": return "text-red-500";
      default: return "";
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    setPasswordStrength(checkPasswordStrength(password));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setPasswordLoading(selectedUser._id);
    try {
      const response = await axios.post(
        "https://degreefydcmsbe.onrender.com/api/auth/reset-password",
        { id: selectedUser._id, newPassword }
      );

      if (response.data.success) {
        toast.success("Password reset successfully");
        setShowPasswordModal(false);
      } else {
        toast.error("Failed to reset password: " + (response.data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error(
        "Failed to reset password: " +
          (error.response?.data?.error || error.message || "Unknown error")
      );
    } finally {
      setPasswordLoading(null);
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role || "Content-creator");
    setShowRoleModal(true);
  };

  const handleChangeRole = async () => {
    if (!newRole) {
      toast.error("Please select a role");
      return;
    }

    setRoleLoading(selectedUser._id);
    try {
      const response = await axios.post(
        "https://degreefydcmsbe.onrender.com/api/auth/change-role",
        { id: selectedUser._id, role: newRole }
      );

      if (response.data.success) {
        toast.success(`Role changed to ${newRole} successfully`);
        // Update the user's role in the state
        setUsers(
          users.map((user) =>
            user._id === selectedUser._id ? { ...user, role: newRole } : user
          )
        );
        setShowRoleModal(false);
      } else {
        toast.error("Failed to change role: " + (response.data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error changing role:", error);
      toast.error(
        "Failed to change role: " +
          (error.response?.data?.error || error.message || "Unknown error")
      );
    } finally {
      setRoleLoading(null);
    }
  };

  // Format role with first letter capitalized
  const formatRole = (role) => {
    if (!role) return "User";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Modals
  const RoleModal = () => {
    if (!showRoleModal) return null;
    return (
      <div className="fixed inset-0 bg-transparent backdrop-blur-xl flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-md shadow-2xl">
          <h3 className="text-xl font-semibold mb-4">Change User Role</h3>
          <p className="mb-3">
            Change role for <span className="font-bold">{selectedUser?.username}</span>
          </p>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Select New Role
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="Admin">Admin</option>
              <option value="content-creator">Content Creator</option>
              <option value="approver">Approver</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              onClick={() => setShowRoleModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-[#155DFC]"
              onClick={handleChangeRole}
              disabled={roleLoading === selectedUser?._id}
            >
              {roleLoading === selectedUser?._id ? "Updating..." : "Update Role"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PasswordModal = () => {
    if (!showPasswordModal) return null;
    return (
      <div className="fixed inset-0 bg-transparent backdrop-blur-xl flex items-center justify-center z-50 ">
        <div className="bg-white rounded-lg p-6 w-96 max-w-md shadow-2xl">
          <h3 className="text-xl font-semibold mb-4">Reset Password</h3>
          <p className="mb-3">
            Reset password for <span className="font-bold">{selectedUser?.username}</span>
          </p>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                value={newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password (min 6 characters)"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700 focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {newPassword && (
              <div className="mt-1">
                <span className="text-sm">
                  Password Strength: <span className={getPasswordStrengthColor(passwordStrength)}>{passwordStrength}</span>
                </span>
                {passwordStrength === "Too Short" && (
                  <p className="text-sm text-red-500">Password must be at least 6 characters</p>
                )}
                {passwordStrength !== "Too Short" && passwordStrength !== "Strong" && (
                  <p className="text-sm text-gray-600">
                    For a stronger password, include uppercase letters, numbers, and special characters
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-[#155DFC] text-white rounded hover:bg-[#155DFC]"
              onClick={handleResetPassword}
              disabled={passwordLoading === selectedUser?._id || (newPassword && newPassword.length < 6)}
            >
              {passwordLoading === selectedUser?._id ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading)
    return <div className="p-4 text-center">Loading user data...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (users.length === 0)
    return <div className="p-4 text-center">No users found.</div>;

  return (
    <div className="p-4 pt-20">
      <ToastContainer position="top-right" autoClose={3000} />
      <RoleModal />
      <PasswordModal />
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Username</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Total Colleges</th>
              <th className="px-4 py-2 border">Approved</th>
              <th className="px-4 py-2 border">Rejected</th>
              <th className="px-4 py-2 border">Pending</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{user.username || "N/A"}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">{formatRole(user.role)}</td>
                <td className="px-4 py-2 border text-center">
                  {user.collegeCount}
                </td>
                <td className="px-4 py-2 border text-center">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    {user.approvedCount}
                  </span>
                </td>
                <td className="px-4 py-2 border text-center">
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full">
                    {user.rejectedCount}
                  </span>
                </td>
                <td className="px-4 py-2 border text-center">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                    {user.pendingCount}
                  </span>
                </td>
                <td className="px-4 py-2 border flex space-x-1">
                  <button
                    className="px-2 py-1 bg-[#155DFC] text-white text-sm rounded hover:bg-[#155DFC]"
                    onClick={() => openPasswordModal(user)}
                  >
                    Reset Password
                  </button>
                  <button
                    className="px-2 py-1 bg-purple-500 text-white text-sm rounded hover:bg-[#155DFC]"
                    onClick={() => openRoleModal(user)}
                  >
                    Change Role
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    onClick={() => handleDeleteUser(user._id)}
                    disabled={deleteLoading === user._id}
                  >
                    {deleteLoading === user._id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListUser;