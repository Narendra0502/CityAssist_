import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assessts/cityassist6.0.jpg'; // Adjust the path as necessary
import { 
  HiHome, 
  HiLocationMarker, 
  HiCheckCircle, 
  HiXCircle, 
  HiClipboardCheck, 
  HiUserGroup, 
  HiLogout,
  HiMenu,
  HiX
} from 'react-icons/hi';

const AdminNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
    
    // Redirect to admin login page
    navigate('/adminlogin');
  };

  // Handle mobile menu item click
  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3 min-w-0">
            <img 
              src={logo}
              alt="CityAssist Logo" 
              className="h-12 w-16 sm:h-15 sm:w-20 object-contain flex-shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-blue-800 truncate">
                <span className="hidden sm:inline">City Assist Admin Dashboard</span>
                <span className="sm:hidden">Admin Dashboard</span>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 group
                  ${location.pathname === item.path 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-blue-700 hover:bg-blue-100 hover:text-blue-800'}
                `}
              >
                <item.icon 
                  className={`w-5 h-5 ${
                    location.pathname === item.path 
                      ? 'text-white' 
                      : 'text-blue-600 group-hover:text-blue-800'
                  }`} 
                />
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
</Link>
            ))}

            {/* Desktop Logout Button */}
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
              <span className="text-sm font-medium whitespace-nowrap">
                Logout
              </span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-md text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="py-3 space-y-1 border-t border-gray-200">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                onClick={handleMobileNavClick}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                  ${location.pathname === item.path 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-blue-700 hover:bg-blue-50 hover:text-blue-800'}
                `}
              >
                <item.icon 
                  className={`w-5 h-5 flex-shrink-0 ${
                    location.pathname === item.path 
                      ? 'text-white' 
                      : 'text-blue-600 group-hover:text-blue-800'
                  }`} 
                />
                <span className="font-medium">
                  {item.label}
                </span>
              </Link>
            ))}

            {/* Mobile Logout Button */}
            <button 
              onClick={handleLogout}
              className="
                w-full flex items-center space-x-3 
                bg-red-500 hover:bg-red-600 
                text-white 
                px-4 py-3 
                rounded-lg 
                transition-all duration-200
                group
                mt-2
              "
            >
              <HiLogout className="w-5 h-5 flex-shrink-0 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-medium">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavBar;
