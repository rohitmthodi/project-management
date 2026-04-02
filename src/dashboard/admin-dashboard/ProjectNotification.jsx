import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProjectNotification = ({ onClose }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3005/projects");
      
      let filteredProjects = [];
      
      if (userRole === "Admin") {
        filteredProjects = res.data;
      } else {
        filteredProjects = res.data.filter(
          (project) => project.employee === loggedInUser?.name
        );
      }
      
      setProjects(filteredProjects);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Notifications</h2>
            <p className="text-sm text-gray-500 mt-1">
              {userRole === "Admin" 
                ? "All project updates" 
                : `Projects assigned to ${loggedInUser?.name}`}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-black text-lg"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading notifications...
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              {userRole === "Admin" 
                ? "No projects found" 
                : "No projects assigned to you yet"}
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div 
                  key={project.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>👤 Assigned to: {project.employee || 'Not assigned'}</span>
                        <span>📋 Task: {project.task || 'No task'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectNotification;