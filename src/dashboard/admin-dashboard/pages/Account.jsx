import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaSave, FaTimes, FaEdit } from "react-icons/fa";

const Account = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Get logged in user
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`http://localhost:3005/employees/${loggedInUser.id}`);
      setUser(res.data);
      setFormData({
        name: res.data.name,
        email: res.data.email,
        password: "" // Keep password field empty initially
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        role: user?.role
      };

      // Only update password if user entered a new one
      if (formData.password && formData.password.trim() !== "") {
        updateData.password = formData.password;
      } else {
        // Keep the old password
        updateData.password = user?.password;
      }

      await axios.put(`http://localhost:3005/employees/${loggedInUser.id}`, updateData);
      
      // Update localStorage
      const updatedUser = { 
        ...loggedInUser, 
        name: formData.name, 
        email: formData.email,
        password: updateData.password // Store updated or old password
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setMessage({ type: "success", text: "Profile updated successfully! ✅" });
      setIsEditing(false);
      fetchUserData();
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.log(error);
      setMessage({ type: "error", text: "Error updating profile ❌" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      password: "" // Reset password field to empty
    });
    setMessage({ type: "", text: "" });
  };

  if (!user) {
    return (
      <div className="bg-white p-5 rounded-xl shadow-md h-full flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow-md h-full overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <div>
          <h2 className="text-2xl font-semibold">My Account</h2>
          <p className="text-gray-500 text-sm mt-1">
            {userRole === "Admin" ? "Administrator Account" : "Employee Account"}
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaEdit size={16} />
            Edit Profile
          </button>
        )}
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.type === "success" 
            ? "bg-green-100 text-green-700 border border-green-200" 
            : "bg-red-100 text-red-700 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Info */}
      <div className="max-w-2xl">
        {/* Profile Picture Placeholder */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-gray-500 text-sm">
              {userRole === "Admin" ? "🔐 Administrator" : "👤 Employee"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUser className="inline mr-2 text-gray-400" size={14} />
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            ) : (
              <p className="text-gray-800 p-2.5 bg-gray-50 rounded-lg">{user.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaEnvelope className="inline mr-2 text-gray-400" size={14} />
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            ) : (
              <p className="text-gray-800 p-2.5 bg-gray-50 rounded-lg">{user.email}</p>
            )}
          </div>

          {/* Role Field (Read Only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <p className="text-gray-800 p-2.5 bg-gray-50 rounded-lg">
              {user.role}
              {userRole === "Admin" && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Full Access</span>
              )}
            </p>
          </div>

          {/* Password Field (Only in edit mode) */}
          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaLock className="inline mr-2 text-gray-400" size={14} />
                New Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave empty to keep current password"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Only enter a new password if you want to change it
              </p>
            </div>
          )}

          {/* Account Info */}
          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Account ID:</span>
              <span className="font-mono">{user.id}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Member Since:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                <FaSave size={16} />
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                <FaTimes size={16} />
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Account;