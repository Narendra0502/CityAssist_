import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assessts/cityassist6.0.jpg'; // Adjust the path as necessary
import { 
  HiHome, 
  HiLocationMarker, 
  HiCheckCircle, 
  HiXCircle, 
  HiClipboardCheck, 
  HiUserGroup, 
  HiLogout 
} from 'react-icons/hi';

const AdminNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items with icons and paths
  const navItems = [
    { path: "/adminhome", label: "Home", icon: HiHome },
    { path: "/Location", label: "Location", icon: HiLocationMarker },
    { path: "/Accepted", label: "Accepted", icon: HiCheckCircle },
    { path: "/Rejected", label: "Rejected", icon: HiXCircle },
    { path: "/Completed", label: "Completed", icon: HiClipboardCheck },
    { path: "/Connect", label: "Connect", icon: HiUserGroup }
  ];

  // Handle logout functionality
  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    sessionStorage.clear();

    // Redirect to admin login page
    navigate('/adminlogin');
  };

  return (
    <header className="bg-white shadow-md px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <img 
            src={logo}
            alt="CityAssist Logo" 
            className="h-15 w-20 object-contain"
          />
          <h1 className="text-xl font-bold text-blue-800">
            City Assist Admin Dashboard
          </h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-1">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={
                flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 group
                ${location.pathname === item.path 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-blue-700 hover:bg-blue-100 hover:text-blue-800'}
              }
            >
              <item.icon 
                className={w-5 h-5 ${
                  location.pathname === item.path 
                    ? 'text-white' 
                    : 'text-blue-600 group-hover:text-blue-800'
                }} 
              />
              <span className="hidden lg:inline text-sm font-medium whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          ))}

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="
              flex items-center space-x-2 
              bg-red-500 hover:bg-red-600 
              text-white 
              px-3 py-2 
              rounded-lg 
              transition-all duration-300
              shadow-sm hover:shadow-md
              group
              ml-2
            "
          >
            <HiLogout className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span className="hidden lg:inline text-sm font-medium whitespace-nowrap">
              Logout
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default AdminNavBar;
