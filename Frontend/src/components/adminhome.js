import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTachometerAlt, FaUsers, FaChartBar, FaBars, FaTimes } from "react-icons/fa";
import IssueCard from "./IssueCard";

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found in localStorage");
          setError("Authentication token missing");
          setLoading(false);
          return;
        }

        const response = await fetch("https://cityassist-backend.onrender.com/admin/getUserIssueData", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) {
          console.error("Unauthorized access. Redirecting to login.");
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // const sortedData = Array.isArray(data) ? 
        // data.sort((a, b) => (b.priority || 0) - (a.priority || 0)) : [];
        setIssues(Array.isArray(data) ? data : []);
        setError(null);
      } catch (error) {
        console.error("Error fetching issues:", error);
        setError("Failed to load issues. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
    const intervalId = setInterval(fetchIssues, 30000);
    return () => clearInterval(intervalId);
  }, [navigate]);

  // Count issues by status
  const countIssuesByStatus = (status) => {
    return issues.filter(issue => issue.status?.toLowerCase() === status).length;
  };

  const pendingCount = countIssuesByStatus("pending");
  const acceptedCount = countIssuesByStatus("accepted");
  const rejectedCount = countIssuesByStatus("rejected");
  const completedCount = countIssuesByStatus("completed");

  // Filtering only Pending Issues
  const pendingIssues = issues.filter(issue => issue.status?.toLowerCase() === "pending");

  // Sorting pending issues
  const sortedIssues = pendingIssues.sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === "priority") return (b.priority || 0) - (a.priority || 0);
    return 0;
  });

  return (
    <div className="flex min-h-screen bg-blue-50">
      <div className="flex w-full relative">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden fixed top-4 left-4 z-50 bg-blue-800 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          bg-blue-800 text-white w-64 px-4 py-8 shadow-lg z-40
          lg:relative lg:translate-x-0
          fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="mb-10 text-center mt-12 lg:mt-0">
            <h1 className="text-xl lg:text-2xl font-bold text-white flex items-center justify-center">
              <FaChartBar className="mr-2 lg:mr-3" /> 
              <span className="hidden sm:inline">Admin Panel</span>
            </h1>
          </div>
          <nav>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/Accepted" 
                  className="flex items-center p-3 rounded-lg text-white hover:bg-blue-700 transition-colors group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <FaTachometerAlt className="mr-3 text-blue-300 group-hover:text-white flex-shrink-0" />
                  <span className="text-sm lg:text-base">Issues Management</span>
                </a>
              </li>
              <li>
                <a 
                  href="Rejected"  
                  className="flex items-center p-3 rounded-lg text-blue-200 hover:bg-blue-700 hover:text-white transition-colors group"
                  onClick={() => setSidebarOpen(false)}
                >
                  <FaUsers className="mr-3 text-blue-300 group-hover:text-white flex-shrink-0" />
                  <span className="text-sm lg:text-base">Rejected Issues</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header with mobile spacing */}
            <div className="mt-16 lg:mt-0 mb-6">
              <h2 className="text-2xl sm:text-3xl font-semibold text-blue-800 mb-4 lg:mb-6 border-b-2 border-blue-200 pb-3 lg:pb-4">
                Pending Citizen Issues
              </h2>
            </div>

            {/* Search & Sort Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-3 lg:gap-4">
              <div className="relative flex-1 max-w-full sm:max-w-md lg:max-w-lg">
                <input
                  type="text"
                  placeholder="Search pending issues..."
                  className="w-full p-2.5 lg:p-3 pl-9 lg:pl-10 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm text-sm lg:text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 lg:top-4 text-blue-400 text-sm lg:text-base" />
              </div>

              <select 
                className="p-2.5 lg:p-3 border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm text-sm lg:text-base min-w-0 sm:min-w-[160px]"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Sort by Newest</option>
                <option value="oldest">Sort by Oldest</option>
                <option value="priority">Sort by Priority</option>
              </select>
            </div>

            {/* Stats for All Issues */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
              {[
                { count: pendingCount, label: "Pending Issues", color: "red" },
                { count: acceptedCount, label: "Accepted Issues", color: "green" },
                { count: completedCount, label: "Completed Issues", color: "yellow" },
                { count: rejectedCount, label: "Rejected Issues", color: "gray" }
              ].map(({ count, label, color }) => (
                <div 
                  key={label} 
                  className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-md border border-blue-100 text-center transform transition-all hover:scale-105 hover:shadow-lg"
                >
                  <span className={`block text-2xl sm:text-3xl lg:text-4xl font-bold text-${color}-500 mb-1 lg:mb-2`}>
                    {count}
                  </span>
                  <span className="text-blue-600 text-xs sm:text-sm font-medium leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                <p className="text-sm lg:text-base">{error}</p>
              </div>
            )}

            {/* Issue Cards (Only Pending Issues) */}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {sortedIssues.length > 0 ? (
                  sortedIssues
                    .filter((issue) => issue.title.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((issue) => (
                      <IssueCard 
                        key={issue._id} 
                        issue={{
                          ...issue,
                          upvotes: issue.upvotes || 0,
                          downvotes: issue.downvotes || 0,
                          priority: issue.priority || 0
                        }}
                      />
                    ))
                ) : (
                  <div className="col-span-full text-center py-8 lg:py-10 bg-blue-50 rounded-lg">
                    <p className="text-blue-600 text-base lg:text-lg">
                      {searchTerm ? 'No issues found matching your search.' : 'No pending issues found.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
