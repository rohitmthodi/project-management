import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import AddEmployees from "./AddEmployees";
import axios from "axios";

const EmployeesPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:3005/employees");
      setEmployees(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEditClick = (emp) => {
    setSelectedEmployee(emp);
    setShowPopup(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await axios.delete(`http://localhost:3005/employees/${id}`);
        alert("Employee Deleted ✅");
        fetchEmployees(); // Refresh the list
      } catch (error) {
        console.log(error);
        alert("Error deleting employee");
      }
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md h-full overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">Employees</h2>

        {/* Add Button */}
        <button
          onClick={() => {
            setSelectedEmployee(null);
            setShowPopup(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FaPlus />
          Add Employee
        </button>
      </div>

      {showPopup && (
        <AddEmployees
          onClose={() => {
            setShowPopup(false);
            setSelectedEmployee(null);
          }}
          editData={selectedEmployee}
          refreshEmployees={fetchEmployees}
        />
      )}

      <div className="mt-5 overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden text-center">
          {/* Header */}
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4 border border-black/10">Name</th>
              <th className="py-3 px-4 border border-black/10">Role</th>
              <th className="py-3 px-4 border border-black/10">Email</th>
              <th className="py-3 px-4 border border-black/10">Password</th>
              <th className="py-3 px-4 border border-black/10">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No Employees Found
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="even:bg-gray-100 odd:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 border border-black/10">
                    {emp.name}
                  </td>
                  <td className="py-3 px-4 border border-black/10">
                    {emp.role}
                  </td>
                  <td className="py-3 px-4 border border-black/10">
                    {emp.email}
                  </td>
                  <td className="py-3 px-4 border border-black/10">
                    {emp.password}
                  </td>

                  <td className="py-3 px-4 border border-black/20 space-x-3">
                    <button
                      onClick={() => handleEditClick(emp)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id, emp.name)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
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

export default EmployeesPage;