import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTachometerAlt, FaUsers, FaChartBar } from "react-icons/fa";
import IssueCard from "./IssueCard";

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

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

        const response = await fetch("http://localhost:5000/admin/getUserIssueData", {
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
    return 0;
  });

  return (
    <div className="flex min-h-screen bg-blue-50">
      <div className="flex w-full">
        {/* Sidebar */}
        <aside className="bg-blue-800 text-white w-64 px-4 py-8 shadow-lg">
          <div className="mb-10 text-center">
            <h1 className="text-2xl font-bold text-white flex items-center justify-center">
              <FaChartBar className="mr-3" /> Admin Panel
            </h1>
          </div>
          <nav>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#" 
                  className="flex items-center p-3 rounded-lg text-white hover:bg-blue-700 transition-colors group"
                >
                  <FaTachometerAlt className="mr-3 text-blue-300 group-hover:text-white" />
                  Issues Management
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="flex items-center p-3 rounded-lg text-blue-200 hover:bg-blue-700 hover:text-white transition-colors group"
                >
                  <FaUsers className="mr-3 text-blue-300 group-hover:text-white" />
                  User Management
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-semibold text-blue-800 mb-6 border-b-2 border-blue-200 pb-4">
              Pending Citizen Issues
            </h2>

            {/* Search & Sort Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search pending issues..."
                  className="w-full p-3 pl-10 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-4 text-blue-400" />
              </div>

              <select 
                className="p-3 border border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Sort by Newest</option>
                <option value="oldest">Sort by Oldest</option>
              </select>
            </div>

            {/* Stats for All Issues */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[
                { count: pendingCount, label: "Pending Issues", color: "red" },
                { count: acceptedCount, label: "Accepted Issues", color: "green" },
                { count: completedCount, label: "Completed Issues", color: "yellow" },
                { count: rejectedCount, label: "Rejected Issues", color: "gray" }
              ].map(({ count, label, color }) => (
                <div 
                  key={label} 
                  className={`bg-white p-6 rounded-lg shadow-md border border-blue-100 text-center transform transition-all hover:scale-105 hover:shadow-lg`}
                >
                  <span className={`block text-4xl font-bold text-${color}-500 mb-2`}>{count}</span>
                  <span className="text-blue-600 text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>

            {/* Issue Cards (Only Pending Issues) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedIssues.length > 0 ? (
                sortedIssues
                  .filter((issue) => issue.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((issue) => <IssueCard key={issue._id} issue={issue} />)
              ) : (
                <div className="col-span-full text-center py-10 bg-blue-50 rounded-lg">
                  <p className="text-blue-600 text-lg">No pending issues found.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;