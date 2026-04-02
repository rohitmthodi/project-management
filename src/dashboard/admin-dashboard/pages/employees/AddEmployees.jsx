import React, { useState, useEffect } from "react";
import axios from "axios";

const AddEmployees = ({ onClose, editData, refreshEmployees }) => {
  const [employeeData, setEmployeeData] = useState(
    editData || {
      name: "",
      email: "",
      password: "",
      role: ""
    }
  );
  
  const [roles, setRoles] = useState([]);

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      const data = await fetch("http://localhost:3005/roles");
      const convert = await data.json();
      setRoles(convert);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editData) {
        await axios.put(`http://localhost:3005/employees/${editData.id}`, employeeData);
        alert("Employee Updated ✅");
      } else {
        await axios.post("http://localhost:3005/employees", employeeData);
        alert("Employee Added ✅");
      }

      refreshEmployees();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">{editData ? "Edit Employee" : "Add Employee"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            name="name" 
            value={employeeData.name} 
            onChange={handleChange} 
            placeholder="Full Name" 
            className="border border-gray-300 p-2 w-full rounded-md" 
            required 
          />
          
          <input 
            type="email" 
            name="email" 
            value={employeeData.email} 
            onChange={handleChange} 
            placeholder="Email" 
            className="border border-gray-300 p-2 w-full rounded-md" 
            required 
          />
          
          <input 
            type="text" 
            name="password" 
            value={employeeData.password} 
            onChange={handleChange} 
            placeholder="Password" 
            className="border border-gray-300 p-2 w-full rounded-md" 
            required 
          />
          
          <select 
            name="role" 
            value={employeeData.role} 
            onChange={handleChange} 
            className="border border-gray-300 p-2 w-full rounded-md" 
            required
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>

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

export default AddEmployees;