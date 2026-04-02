import { FaUserShield, FaUsers, FaProjectDiagram, FaTasks } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";

export const adminDashboardItems = [
    {
        id: 2,
        title: "Roles",
        path: "/admin/roles",
        icon: FaUserShield,
        permission: "roles"
    },
    {
        id: 3,
        title: "Employees",
        path: "/admin/employees",
        icon: FaUsers,
        permission: "employees"
    },
    {
        id: 4,
        title: "Projects",
        path: "/admin/projects",
        icon: FaProjectDiagram,
        permission: "projects"
    },
    {
        id: 5,
        title: "Tasks",
        path: "/admin/tasks",
        icon: FaTasks,
        permission: "tasks"
    },
];