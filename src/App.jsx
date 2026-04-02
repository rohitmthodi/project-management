import React from "react";
import Admin from "./dashboard/admin-dashboard/Admin";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard/admin-dashboard/pages/dashboard/Dashboard";
import Roles from "./dashboard/admin-dashboard/pages/roles/Roles";
import Employees from "./dashboard/admin-dashboard/pages/employees/Employees";
import Projects from "./dashboard/admin-dashboard/pages/projects/Projects";
import Tasks from "./dashboard/admin-dashboard/pages/tasks/Tasks";
import Settings from "./dashboard/admin-dashboard/pages/Settings";
import Account from "./dashboard/admin-dashboard/pages/Account";
import Login from "./dashboard/login/Login";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Roles />} />
          <Route path="roles" element={<Roles />} />
          <Route path="employees" element={<Employees />} />
          <Route path="projects" element={<Projects />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="account" element={<Account />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
