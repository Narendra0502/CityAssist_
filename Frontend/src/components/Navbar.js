import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, Home, FileText, Activity } from 'lucide-react'

const Navbar = ({ islogedin, setlogin }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  // Handle scroll position and navbar visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Determine scroll direction
      if (currentScrollTop > lastScrollTop) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
      setScrollPosition(currentScrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  const handleLogout = () => {
    setlogin(false);
    navigate("/signup");
  }

  return (
    <header 
      className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out
        ${scrollPosition > 50 ? 'bg-white/90 shadow-md backdrop-blur-sm' : 'bg-white'}
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
      `}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-blue-700">CityAssist</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors group"
          >
            <Home className="mr-2 w-5 h-5 text-gray-500 group-hover:text-blue-600" />
            Home
          </Link>
          <Link 
            to="/issues" 
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors group"
          >
            <FileText className="mr-2 w-5 h-5 text-gray-500 group-hover:text-blue-600" />
            Issues
          </Link>
          <Link 
            to="/status" 
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors group"
          >
            <Activity className="mr-2 w-5 h-5 text-gray-500 group-hover:text-blue-600" />
            Status
          </Link>

          {islogedin ? (
            <button 
              onClick={handleLogout}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              <LogOut className="mr-2 w-5 h-5" />
              Logout
            </button>
          ) : (
            <Link 
              to="/signup" 
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-800 focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden">
            <nav className="flex flex-col p-4 space-y-3">
              <Link 
                to="/" 
                className="flex items-center py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="mr-3 w-5 h-5 text-gray-500" />
                Home
              </Link>
              <Link 
                to="/issues" 
                className="flex items-center py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <FileText className="mr-3 w-5 h-5 text-gray-500" />
                Issues
              </Link>
              <Link 
                to="/status" 
                className="flex items-center py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <Activity className="mr-3 w-5 h-5 text-gray-500" />
                Status
              </Link>

              {islogedin ? (
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <LogOut className="mr-2 w-5 h-5" />
                  Logout
                </button>
              ) : (
                <Link 
                  to="/signup" 
                  className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
