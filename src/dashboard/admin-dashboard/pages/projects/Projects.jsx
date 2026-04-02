import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import AddProjects from "./AddProjects";
import axios from "axios";

const Projects = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Get user permissions from localStorage
  const userPermissions = JSON.parse(localStorage.getItem("userPermissions"));
  const userRole = localStorage.getItem("role");

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:3005/projects");
      setProjects(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEditClick = (proj) => {
    setSelectedProject(proj);
    setShowPopup(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" project?`)) {
      try {
        await axios.delete(`http://localhost:3005/projects/${id}`);
        alert("Project Deleted ✅");
        fetchProjects();
      } catch (error) {
        console.log(error);
        alert("Error deleting project");
      }
    }
  };

  // Check permissions
  const canCreate = userRole === "Admin" || userPermissions?.projects?.create;
  const canEdit = userRole === "Admin" || userPermissions?.projects?.edit;
  const canDelete = userRole === "Admin" || userPermissions?.projects?.delete;

  return (
    <div className="bg-white p-5 rounded-xl shadow-md h-full overflow-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">Projects</h2>

        {/* Add Button - Only show if user has create permission */}
        {canCreate && (
          <button
            onClick={() => {
              setSelectedProject(null);
              setShowPopup(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <FaPlus />
            Add Project
          </button>
        )}
      </div>

      {/* Popup */}
      {showPopup && (
        <AddProjects
          onClose={() => {
            setShowPopup(false);
            setSelectedProject(null);
          }}
          editData={selectedProject}
          refreshProjects={fetchProjects}
        />
      )}

      {/* Table */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden text-center">

          {/* Header */}
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4 border">Name</th>
              <th className="py-3 px-4 border">Description</th>
              <th className="py-3 px-4 border">Employee</th>
              <th className="py-3 px-4 border">Task</th>
              <th className="py-3 px-4 border">Actions</th>
             </tr>
          </thead>

          {/* Body */}
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No Projects Found
                </td>
              </tr>
            ) : (
              projects.map((proj) => (
                <tr
                  key={proj.id}
                  className="even:bg-gray-100 odd:bg-gray-50"
                >
                  <td className="py-3 px-4 border">{proj.name}</td>
                  <td className="py-3 px-4 border">{proj.description}</td>
                  <td className="py-3 px-4 border">{proj.employee}</td>
                  <td className="py-3 px-4 border">{proj.task}</td>

                  <td className="py-3 px-4 border space-x-3">
                    {/* Edit Button - Only show if user has edit permission */}
                    {canEdit && (
                      <button
                        onClick={() => handleEditClick(proj)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                    )}

                    {/* Delete Button - Only show if user has delete permission */}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(proj.id, proj.name)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    )}

                    {!canEdit && !canDelete && (
                      <span className="text-gray-400">No actions available</span>
                    )}
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

export default Projects;