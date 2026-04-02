import React, { useState, useEffect } from "react";
import axios from "axios";

const AddProjects = ({ onClose, editData, refreshProjects }) => {
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    employee: "",
    task: ""
  });
  
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:3005/employees");
      setEmployees(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:3005/tasks");
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchTasks();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setProjectData({
        name: editData.name || "",
        description: editData.description || "",
        employee: editData.employee || "",
        task: editData.task || ""
      });
    }
  }, [editData]);

  // handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editData) {
        await axios.put(`http://localhost:3005/projects/${editData.id}`, projectData);
        alert("Project Updated ✅");
      } else {
        await axios.post("http://localhost:3005/projects", projectData);
        alert("Project Added ✅");
      }

      // reset
      setProjectData({
        name: "",
        description: "",
        employee: "",
        task: ""
      });

      if (refreshProjects) refreshProjects();
      onClose(); // close popup
    } catch (error) {
      console.log(error);
      alert("Error saving project");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl relative">

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">{editData ? "Edit Project" : "Create Project"}</h2>

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
            value={projectData.name}
            onChange={handleChange}
            placeholder="Project Name"
            className="border border-gray-300 p-2 w-full rounded-md"
            required
          />

          <textarea
            name="description"
            value={projectData.description}
            onChange={handleChange}
            placeholder="Description"
            rows={4}
            className="border border-gray-300 p-3 w-full rounded-lg resize-none"
          />

          {/* Employee Select Dropdown */}
          <select
            name="employee"
            value={projectData.employee}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 w-full rounded-md outline-none"
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.name}>
                {emp.name}
              </option>
            ))}
          </select>

          {/* Task Select Dropdown */}
          <select
            name="task"
            value={projectData.task}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 w-full rounded-md outline-none"
          >
            <option value="">Select Task</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.name}>
                {task.name}
              </option>
            ))}
          </select>

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

export default AddProjects;