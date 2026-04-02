import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import AddRoles from "./AddRoles";
import axios from "axios";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const fetchRoles = async () => {
    const data = await fetch("http://localhost:3005/roles");
    const convert = await data.json();
    setRoles(convert);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleEdit = (role) => {
    setSelectedRole(role);
    setShowPopup(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" role?`)) {
      try {
        await axios.delete(`http://localhost:3005/roles/${id}`);
        alert("Role Deleted ✅");
        fetchRoles();
      } catch (error) {
        console.log(error);
        alert("Error deleting role");
      }
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md h-full">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">Roles</h2>

        <button
          onClick={() => {
            setSelectedRole(null);
            setShowPopup(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FaPlus />
          Add Role
        </button>
      </div>

      {/* Popup */}
      {showPopup && (
        <AddRoles
          onClose={() => {
            setShowPopup(false);
            setSelectedRole(null);
          }}
          refreshRoles={fetchRoles}
          editData={selectedRole}
        />
      )}

      {/* Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden text-center">

          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4 border">Role Name</th>
              <th className="py-3 px-4 border">Permissions</th>
              <th className="py-3 px-4 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {roles.length === 0 ? (
              <tr>
                <td colSpan="3" className="py-6 text-gray-500">
                  No Roles Found
                </td>
              </tr>
            ) : (
              roles.map((item) => (
                <tr key={item.id} className="even:bg-gray-100 odd:bg-gray-50">
                  <td className="py-3 px-4 border font-medium">
                    {item.name}
                    {item.description && (
                      <div className="text-xs text-gray-500 font-normal mt-1">
                        {item.description}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4 border">
                    <div className="flex flex-col gap-2 text-sm">
                      {item.permissions && (
                        <>
                          {/* Projects Permissions */}
                          <div className="flex justify-center items-center gap-2 flex-wrap">
                            <span className="font-medium text-gray-700 min-w-15">Projects:</span>
                            <div className="flex gap-1.5 flex-wrap">
                              {item.permissions.projects?.create && (
                                <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                  Create ✓
                                </span>
                              )}
                              {item.permissions.projects?.edit && (
                                <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                  Edit ✓ 
                                </span>
                              )}
                              {item.permissions.projects?.delete && (
                                <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                  Delete ✓ 
                                </span>
                              )}
                              {!item.permissions.projects?.create && 
                               !item.permissions.projects?.edit && 
                               !item.permissions.projects?.delete && (
                                <span className="text-gray-400 text-xs">No permissions</span>
                              )}
                            </div>
                          </div>

                          {/* Tasks Permissions */}
                          <div className="flex justify-center items-center gap-2 flex-wrap">
                            <span className="font-medium text-gray-700 min-w-15">Tasks:</span>
                            <div className="flex gap-1.5 flex-wrap">
                              {item.permissions.tasks?.create && (
                                <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                  Create ✓ 
                                </span>
                              )}
                              {item.permissions.tasks?.edit && (
                                <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                  Edit ✓ 
                                </span>
                              )}
                              {item.permissions.tasks?.delete && (
                                <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                  Delete ✓ 
                                </span>
                              )}
                              {!item.permissions.tasks?.create && 
                               !item.permissions.tasks?.edit && 
                               !item.permissions.tasks?.delete && (
                                <span className="text-gray-400 text-xs">No permissions</span>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 border">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default Roles;