import React, { useState } from "react";
import axios from "axios";

const AddProjects = ({ onClose }) => {
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    employee: "",
    task: ""
  });

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
      await axios.post("http://localhost:3005/project", projectData);

      alert("Project Added ✅");

      // reset
      setProjectData({
        name: "",
        description: "",
        employee: "",
        task: ""
      });

      onClose(); // close popup
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl relative">

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Create Project</h2>

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
          />

          <textarea
            name="description"
            value={projectData.description}
            onChange={handleChange}
            placeholder="Description"
            rows={4}
            className="border border-gray-300 p-3 w-full rounded-lg resize-none"
          />

          <select
            name="employee"
            value={projectData.employee}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 w-full rounded-md bg-whit outline-none"
          >
            <option value="">Select Employee</option>
            <option value="Admin">Frontent Developer</option>
            <option value="Employee">Backend Developer</option>
            <option value="Employee">Backend Developer</option>
            <option value="Employee">Manager</option>
          </select>

          <input
            type="text"
            name="task"
            value={projectData.task}
            onChange={handleChange}
            placeholder="Assign Task"
            className="border border-gray-300 p-2 w-full rounded-md"
          />

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
              Add
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProjects;