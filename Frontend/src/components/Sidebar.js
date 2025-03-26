import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const sidebarItems = [
  {
    icon: 'fas fa-ticket-alt',
    text: 'Issues Management',
    path: '/admin-dashboard',
    color: 'teal'
  },
  {
    icon: 'fas fa-users',
    text: 'User Management',
    path: '/user-management',
    color: 'blue'
  },
  {
    icon: 'fas fa-chart-bar',
    text: 'Analytics',
    path: '/analytics',
    color: 'green'
  },
  {
    icon: 'fas fa-cog',
    text: 'Settings',
    path: '/settings',
    color: 'purple'
  }
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <aside 
      className={`
        bg-teal-500 text-white 
        h-screen 
        fixed left-0 top-0 
        transition-all duration-300 
        ${isExpanded ? 'w-64' : 'w-20'}
        shadow-lg
        overflow-hidden
      `}
    >
      {/* Sidebar Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="
          absolute top-4 right-4 
          z-50 
          text-white 
          hover:text-teal-200 
          transition-colors
        "
      >
        <i className={`fas ${isExpanded ? 'fa-chevron-left' : 'fa-chevron-right'} text-xl`}></i>
      </button>

      <nav className="pt-16 pb-8">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.text}>
              <button
                onClick={() => navigate(item.path)}
                className={`
                  flex items-center 
                  w-full 
                  px-6 
                  py-4 
                  transition-all 
                  duration-300 
                  ${location.pathname === item.path 
                    ? `bg-${item.color}-600 text-white` 
                    : `text-${item.color}-100 hover:bg-${item.color}-500/50`
                  }
                  ${isExpanded ? 'justify-start' : 'justify-center'}
                `}
              >
                <i className={`${item.icon} w-6 text-center ${isExpanded ? 'mr-4' : ''}`}></i>
                {isExpanded && <span className="truncate">{item.text}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      {isExpanded && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-teal-600/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-white"></i>
            </div>
            <div>
              <p className="text-sm font-semibold">Admin</p>
              <p className="text-xs text-teal-200">Administrator</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;