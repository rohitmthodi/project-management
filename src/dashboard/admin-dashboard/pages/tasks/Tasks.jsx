import React, { useState, useEffect } from 'react';
import { FaPlus } from "react-icons/fa";
import AddTasks from "./AddTasks";
import axios from "axios";

const Tasks = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Get user permissions from localStorage
  const userPermissions = JSON.parse(localStorage.getItem("userPermissions"));
  const userRole = localStorage.getItem("role");

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:3005/tasks");
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setShowPopup(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" task?`)) {
      try {
        await axios.delete(`http://localhost:3005/tasks/${id}`);
        alert("Task Deleted ✅");
        fetchTasks();
      } catch (error) {
        console.log(error);
        alert("Error deleting task");
      }
    }
  };

  // Check permissions
  const canCreate = userRole === "Admin" || userPermissions?.tasks?.create;
  const canEdit = userRole === "Admin" || userPermissions?.tasks?.edit;
  const canDelete = userRole === "Admin" || userPermissions?.tasks?.delete;

  return (
    <div className="bg-white p-5 rounded-xl shadow-md h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">Tasks</h2>

        {/* Add Button - Only show if user has create permission */}
        {canCreate && (
          <button 
            onClick={() => {
              setSelectedTask(null);
              setShowPopup(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <FaPlus />
            Add Task
          </button>
        )}
      </div>

      {/* Popup */}
      {showPopup && (
        <AddTasks
          onClose={() => {
            setShowPopup(false);
            setSelectedTask(null);
          }}
          editData={selectedTask}
          refreshTasks={fetchTasks}
        />
      )}

      {/* Table */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4 border">Task Name</th>
              <th className="py-3 px-4 border">Actions</th>
             </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center py-6 text-gray-500">
                  No Tasks Found
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id} className="even:bg-gray-100 odd:bg-gray-50">
                  <td className="py-3 px-4 border font-medium">
                    {task.name}
                  </td>
                  <td className="py-3 px-4 border space-x-3">
                    {/* Edit Button - Only show if user has edit permission */}
                    {canEdit && (
                      <button
                        onClick={() => handleEditClick(task)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                    )}

                    {/* Delete Button - Only show if user has delete permission */}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(task.id, task.name)}
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

export default Tasks;