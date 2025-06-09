import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import IssueCard from "./IssueCard"; // ✅ Importing IssueCard

const Completed = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const adminData = localStorage.getItem("admin");
  const adminDepartment = adminData ? JSON.parse(adminData).department : null;

  useEffect(() => {
    const fetchCompletedIssues = async () => {
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
          console.log("✅ Decoded Token (Completed file):", decodedToken);
          if (!decodedToken.department) {
            console.error("❌ No department found in token!");
          } else {
            localStorage.setItem("department", decodedToken.department);
            console.log("✅ Department Found:", decodedToken.department);
          }
        } catch (error) {
          console.error("❌ Error decoding token:", error);
        }

        const response = await fetch("https://cityassist-backend.onrender.com/admin/getCompletedIssues", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch completed issues");
        }

        const data = await response.json();
        console.log("Fetched Completed Issues:", data);

        const filteredIssues = data?.data?.filter(issue => issue.status === "Completed");
        setIssues(filteredIssues);
      } catch (error) {
        console.error("Error fetching issues:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedIssues();
  }, [adminDepartment]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-green-800 mb-6">Completed Issues</h1>

      {loading ? (
        <p>Loading issues...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : issues.length === 0 ? (
        <p>No completed issues found for your department.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Completed;
