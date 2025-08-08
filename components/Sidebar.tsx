import React from "react";

const sidebarLinks = [
  { name: "Architects", href: "/architects", icon: "bi-person-badge" },
  { name: "Projects", href: "/projects", icon: "bi-kanban" },
  { name: "Machines", href: "/machines", icon: "bi-gear-wide-connected" },
  { name: "Materials", href: "/materials", icon: "bi-box-seam" },
  { name: "Employees", href: "/employees", icon: "bi-people" },
  { name: "Tasks", href: "/tasks", icon: "bi-list-check" },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg p-4 sticky top-0 z-20">
      <div className="flex items-center gap-2 mb-8">
        <img src="/consty.png" alt="Logo" className="h-8 w-8" />
        <span className="font-bold text-xl text-blue-700 dark:text-blue-300 tracking-tight">Consty</span>
      </div>
      <nav className="flex flex-col gap-2">
        {sidebarLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 font-medium transition-colors duration-200"
          >
            <i className={`bi ${link.icon} text-lg`}></i>
            {link.name}
          </a>
        ))}
      </nav>
      <div className="mt-auto pt-8 text-xs text-gray-400 dark:text-gray-500 text-center">
        &copy; {new Date().getFullYear()} Consty
      </div>
    </aside>
  );
}
