import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from 'react-hot-toast';


const STATUS_CONFIGS = {
  open: { bgColor: "bg-red-100", textColor: "text-red-600", borderColor: "border-red-300" },
  "in progress": { bgColor: "bg-orange-100", textColor: "text-orange-600", borderColor: "border-orange-300" },
  inprogress: { bgColor: "bg-orange-100", textColor: "text-orange-600", borderColor: "border-orange-300" },
  resolved: { bgColor: "bg-green-100", textColor: "text-green-600", borderColor: "border-green-300" },
  completed: { bgColor: "bg-green-100", textColor: "text-green-600", borderColor: "border-green-300" },
  accepted: { bgColor: "bg-blue-100", textColor: "text-blue-600", borderColor: "border-blue-300" },
  rejected: { bgColor: "bg-gray-100", textColor: "text-gray-600", borderColor: "border-gray-300" },
};

const IssueCard = ({ issue, handleStatusChange }) => {
  const navigate = useNavigate();

  const [votes, setVotes] = useState(issue.votes || 0);

  const getStatusConfig = (status) => {
    const normalizedStatus = status?.toLowerCase() || "open";
    return STATUS_CONFIGS[normalizedStatus] || STATUS_CONFIGS.open;
  };
  const onStatusUpdate = async (issueId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔄 Updating status:', { issueId, newStatus });

      const response = await fetch(`http://localhost:5000/api/issues/${issueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          reason: `Status updated to ${newStatus}`,
          remark: `Updated by admin at ${new Date().toLocaleString()}`
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Status updated successfully');
        console.log('📧 Email notification:', data.emailSent ? 'Sent' : 'Failed');
        if (data.emailPreview) {
          console.log('📨 Email preview:', data.emailPreview);
        }
        toast.success(`Status updated to ${newStatus}`);
        handleStatusChange(issueId, newStatus); // Update parent component
      }
      else {
        console.error('❌ Update failed:', data.error);
        toast.error(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('Error updating status');
    }
  };


  const navigateToIssueDetails = () => {
    navigate(`/adminDetails/${issue._id}`);
  };

  const handleVote = async (voteType) => {
    try {
      const response = await fetch(`http://localhost:5000/api/issues/${issue._id}/vote`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteType }),
      });

      if (response.ok) {
        const updatedIssue = await response.json();
        setVotes(updatedIssue.votes);
      }
    } catch (error) {
      console.error("Error updating vote:", error);
    }
  };

  const statusConfig = getStatusConfig(issue.status);

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm overflow-hidden"
      whileHover={{ scale: 1.015, boxShadow: "0 10px 15px rgba(0, 0, 0, 0.05)" }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      {/* Image Section */}
      <div onClick={navigateToIssueDetails} className="h-48 relative cursor-pointer group">
        {issue.image ? (
          <img src={issue.image} alt={issue.title || "Issue image"} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">No Image</span>
          </div>
        )}
        <span className={`absolute top-4 right-4 px-3 py-1 text-xs font-medium rounded-full ${statusConfig.bgColor} ${statusConfig.textColor}`}>
          {issue.status || "Open"}
        </span>
      </div>

      {/* Content Section */}
      <div onClick={navigateToIssueDetails} className="p-6 space-y-3 cursor-pointer">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{issue.title || "Untitled Issue"}</h3>

        <p className="text-sm text-gray-700 line-clamp-2 mt-4">{issue.description || "No description provided"}</p>
      </div>

      {/* Voting Section */}
      <div className="mt-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <span className="text-green-600">
            👍 {issue.upvotes || 0}
          </span>
          <span className="text-red-600">
            👎 {issue.downvotes || 0}
          </span>
        </div>
        <div className="text-blue-600 font-semibold">
          Priority: {issue.priority || 0}
        </div>
      </div>
      {/* Status Change Section */}
      <div className="px-6 py-4 border-t border-gray-100">
        <select
          value={issue.status || "Open"}
          onChange={(e) => onStatusUpdate(issue._id, e.target.value)}
          className={`w-full p-2 text-sm border rounded ${statusConfig.textColor} ${statusConfig.borderColor} focus:ring-2 focus:ring-opacity-50 transition-all`}
        >
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
    </motion.div>
  );
};

export default IssueCard;
