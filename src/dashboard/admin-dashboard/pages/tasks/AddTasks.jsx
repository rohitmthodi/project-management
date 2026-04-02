import React, { useState, useEffect } from "react";
import axios from "axios";

const AddTasks = ({ onClose, editData, refreshTasks }) => {
  const [taskData, setTaskData] = useState({
    name: ""
  });

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setTaskData({
        name: editData.name || ""
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editData) {
        await axios.put(`http://localhost:3005/tasks/${editData.id}`, taskData);
        alert("Task Updated ✅");
      } else {
        await axios.post("http://localhost:3005/tasks", taskData);
        alert("Task Added ✅");
      }

      refreshTasks();
      onClose();
    } catch (error) {
      console.log(error);
      alert("Error saving task");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">{editData ? "Edit Task" : "Add Task"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            name="name" 
            value={taskData.name} 
            onChange={handleChange} 
            placeholder="Task Name" 
            className="border border-gray-300 p-2 w-full rounded-md" 
            required 
          />

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

export default AddTasks;