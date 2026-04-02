import React, { useState, useEffect } from "react";
import axios from "axios";

const AddRoles = ({ onClose, refreshRoles, editData }) => {

  // ✅ state for roles
  const [roleData, setRoleData] = useState({
    name: "",
    description: "",
    permissions: {
      projects: { create: false, edit: false, delete: false },
      tasks: { create: false, edit: false, delete: false }
    }
  });

  // ✅ populate form when editing
  useEffect(() => {
    if (editData) {
      setRoleData({
        name: editData.name || "",
        description: editData.description || "",
        permissions: editData.permissions || {
          projects: { create: false, edit: false, delete: false },
          tasks: { create: false, edit: false, delete: false }
        }
      });
    } else {
      // Reset form when adding new role
      setRoleData({
        name: "",
        description: "",
        permissions: {
          projects: { create: false, edit: false, delete: false },
          tasks: { create: false, edit: false, delete: false }
        }
      });
    }
  }, [editData]);

  // ✅ handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setRoleData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ handle permission checkbox changes
  const handlePermissionChange = (category, action) => {
    setRoleData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [category]: {
          ...prev.permissions[category],
          [action]: !prev.permissions[category][action]
        }
      }
    }));
  };

  // ✅ submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editData && editData.id) {
        // UPDATE existing role
        await axios.put(`http://localhost:3005/roles/${editData.id}`, roleData);
        alert("Role Updated ✅");
      } else {
        // CREATE new role
        await axios.post("http://localhost:3005/roles", roleData);
        alert("Role Added ✅");
      }

      refreshRoles(); // 🔥 refresh table
      onClose(); // close popup

    } catch (error) {
      console.log(error);
      alert("Error saving role");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">{editData ? "Edit Role" : "Create Role"}</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-lg"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="name"
            value={roleData.name}
            onChange={handleChange}
            placeholder="Role Name"
            className="border border-gray-300 p-2 w-full rounded-md"
            required
          />

          <textarea
            name="description"
            value={roleData.description}
            onChange={handleChange}
            placeholder="Description (optional)"
            rows={3}
            className="border border-gray-300 p-2 w-full rounded-md"
          />

          {/* Permissions Section */}
          <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Permissions</h3>
            
            {/* Projects Section */}
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-600 mb-2">Projects</div>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    checked={roleData.permissions.projects.create}
                    onChange={() => handlePermissionChange("projects", "create")}
                    className="rounded border-gray-300"
                  />
                  Create
                </label>
                <label className="flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    checked={roleData.permissions.projects.edit}
                    onChange={() => handlePermissionChange("projects", "edit")}
                    className="rounded border-gray-300"
                  />
                  Edit
                </label>
                <label className="flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    checked={roleData.permissions.projects.delete}
                    onChange={() => handlePermissionChange("projects", "delete")}
                    className="rounded border-gray-300"
                  />
                  Delete
                </label>
              </div>
            </div>

            {/* Tasks Section */}
            <div>
              <div className="text-sm font-medium text-gray-600 mb-2">Tasks</div>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    checked={roleData.permissions.tasks.create}
                    onChange={() => handlePermissionChange("tasks", "create")}
                    className="rounded border-gray-300"
                  />
                  Create
                </label>
                <label className="flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    checked={roleData.permissions.tasks.edit}
                    onChange={() => handlePermissionChange("tasks", "edit")}
                    className="rounded border-gray-300"
                  />
                  Edit
                </label>
                <label className="flex items-center gap-1.5 text-sm">
                  <input
                    type="checkbox"
                    checked={roleData.permissions.tasks.delete}
                    onChange={() => handlePermissionChange("tasks", "delete")}
                    className="rounded border-gray-300"
                  />
                  Delete
                </label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              {editData ? "Update" : "Add"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddRoles;