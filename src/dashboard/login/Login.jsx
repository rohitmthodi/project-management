import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const adminLoginFunction = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get("http://localhost:3005/employees");

      const user = res.data.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        console.log("Logged in user:", user);
        console.log("User role:", user.role);
        
        // Fetch role permissions
        const rolesRes = await axios.get("http://localhost:3005/roles");
        const userRole = rolesRes.data.find((r) => r.name === user.role);
        
        // Store user and permissions
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", user.role);
        
        if (userRole) {
          localStorage.setItem("userPermissions", JSON.stringify(userRole.permissions));
        } else if (user.role === "Admin") {
          // Admin has full permissions
          localStorage.setItem("userPermissions", JSON.stringify({
            projects: { create: true, edit: true, delete: true },
            tasks: { create: true, edit: true, delete: true }
          }));
        }
        
        navigate("/admin");
      } else {
        setError("Wrong credentials. Try again!");
      }
    } catch (err) {
      console.log(err);
      setError("Server error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        <form onSubmit={adminLoginFunction} className="space-y-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-300 p-2 rounded-md outline-none"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="border border-gray-300 p-2 rounded-md outline-none"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          <p className="text-red-500 text-sm text-center">{error}</p>

          <button
            type="button"
            className="text-blue-500 w-full text-end hover:underline"
          >
            Forgot password?
          </button>

          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition outline-none">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;