import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import IssueCard from "./IssueCard";  // ✅ Importing IssueCard

const Rejected = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const adminData = localStorage.getItem("admin");
  const adminDepartment = adminData ? JSON.parse(adminData).department : null;

  useEffect(() => {
    const fetchRejectedIssues = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("❌ No token found in localStorage");
          setError("Authentication token missing");
          setLoading(false);
          return;
        }

        try {
          const decodedToken = jwtDecode(token);
          console.log("✅ Decoded Token (Rejected file):", decodedToken);
          if (!decodedToken.department) {
            console.error("❌ No department found in token!");
          } else {
            localStorage.setItem("department", decodedToken.department);
            console.log("✅ Department Found:", decodedToken.department);
          }
        } catch (error) {
          console.error("❌ Error decoding token:", error);
        }

        const response = await fetch("http://localhost:5000/admin/getRejectedIssues", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch rejected issues");
        }

        const data = await response.json();
        console.log("Fetched Rejected Issues:", data);

        const filteredIssues = data?.data?.filter(issue => issue.status === "Rejected");
        setIssues(filteredIssues);
      } catch (error) {
        console.error("Error fetching issues:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRejectedIssues();
  }, [adminDepartment]);

  // Function to handle status changes (optional)
  const handleStatusChange = async (issueId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/admin/updateIssueStatus/${issueId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error("Failed to update issue status");
      }

      // Update the status locally
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue._id === issueId ? { ...issue, status: newStatus } : issue
        )
      );
    } catch (error) {
      console.error("Error updating issue status:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-red-800 mb-6">Rejected Issues</h1>

      {loading ? (
        <p>Loading issues...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : issues.length === 0 ? (
        <p>No rejected issues found for your department.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} handleStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Rejected;
