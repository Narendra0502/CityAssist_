import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="bg-teal-800 text-white w-full md:w-64 p-0">
      <nav className="py-8">
        <ul>
          <li className="mb-2">
            <button
              onClick={() => navigate("/admin-dashboard")}
              className="flex items-center w-full px-8 py-4 bg-teal-700 text-white hover:bg-teal-700/50 transition-colors"
            >
              <i className="fas fa-ticket-alt w-5 mr-4 text-center"></i> Issues Management
            </button>
          </li>
          <li className="mb-2">
            <button className="flex items-center w-full px-8 py-4 text-teal-100 hover:bg-teal-700/50 transition-colors">
              <i className="fas fa-users w-5 mr-4 text-center"></i> User Management
            </button>
          </li>
          <li className="mb-2">
            <button className="flex items-center w-full px-8 py-4 text-teal-100 hover:bg-teal-700/50 transition-colors">
              <i className="fas fa-chart-bar w-5 mr-4 text-center"></i> Analytics
            </button>
          </li>
          <li className="mb-2">
            <button className="flex items-center w-full px-8 py-4 text-teal-100 hover:bg-teal-700/50 transition-colors">
              <i className="fas fa-cog w-5 mr-4 text-center"></i> Settings
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
