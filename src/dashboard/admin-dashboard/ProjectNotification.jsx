import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProjectNotification = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    fetchData();
    // DO NOT delete notifications immediately - let admin see them first
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (userRole === "Admin") {
        const notifRes = await axios.get("http://localhost:3005/completedNotifications");
        const projectsRes = await axios.get("http://localhost:3005/projects");
        
        const completedProjects = projectsRes.data.filter(p => p.status === "completed");
        
        const combinedNotifs = notifRes.data.map(notif => ({
          ...notif,
          projectDetails: completedProjects.find(p => p.id === notif.projectId)
        })).filter(n => n.projectDetails);
        
        setNotifications(combinedNotifs);
      } else {
        const projectsRes = await axios.get("http://localhost:3005/projects");
        const employeeProjects = projectsRes.data.filter(
          p => p.employee === loggedInUser?.name && p.status !== "completed"
        );
        setProjects(employeeProjects);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Mark single notification as read (dismiss)
  const markAsRead = async (id) => {
    try {
      await axios.delete(`http://localhost:3005/completedNotifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (window.confirm(`Dismiss all ${notifications.length} notifications?`)) {
      try {
        for (const notif of notifications) {
          await axios.delete(`http://localhost:3005/completedNotifications/${notif.id}`);
        }
        setNotifications([]);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] shadow-xl flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Notifications</h2>
            <p className="text-sm text-gray-500 mt-1">
              {userRole === "Admin" 
                ? "Project completion updates" 
                : `Pending projects for ${loggedInUser?.name}`}
            </p>
          </div>
          <div className="flex gap-3">
            {userRole === "Admin" && notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Dismiss All
              </button>
            )}
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-black text-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading...</div>
          ) : userRole === "Admin" ? (
            notifications.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No new notifications
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className="border border-green-200 bg-green-50 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{notif.projectName}</h3>
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            Completed
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          ✅ Completed by: <span className="font-medium">{notif.employeeName}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Completed at: {new Date(notif.completedAt).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="text-gray-400 hover:text-gray-600 text-sm ml-3"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            projects.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No pending projects! 🎉
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-2">Projects you need to complete:</p>
                {projects.map((project) => (
                  <div 
                    key={project.id}
                    className="border border-yellow-200 bg-yellow-50 rounded-lg p-4"
                  >
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span>📋 Task: {project.task || 'No task'}</span>
                      <span className="text-yellow-600">⏳ Status: Pending</span>
                    </div>
                  </div>
                ))}
              </div>
            )
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