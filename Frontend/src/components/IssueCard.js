import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const STATUS_CONFIGS = {
  open: {
    bgColor: "bg-red-100",
    textColor: "text-red-600",
    borderColor: "border-red-300",
  },
  "in progress": {
    bgColor: "bg-orange-100",
    textColor: "text-orange-600",
    borderColor: "border-orange-300",
  },
  inprogress: {
    bgColor: "bg-orange-100",
    textColor: "text-orange-600",
    borderColor: "border-orange-300",
  },
  resolved: {
    bgColor: "bg-green-100",
    textColor: "text-green-600",
    borderColor: "border-green-300",
  },
  completed: {
    bgColor: "bg-green-100",
    textColor: "text-green-600",
    borderColor: "border-green-300",
  },
  accepted: {
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
    borderColor: "border-blue-300",
  },
  rejected: {
    bgColor: "bg-gray-100",
    textColor: "text-gray-600",
    borderColor: "border-gray-300",
  },
};

const IssueCard = ({ issue, handleStatusChange }) => {
  const navigate = useNavigate();

  const getStatusConfig = (status) => {
    const normalizedStatus = status?.toLowerCase() || "open";
    return STATUS_CONFIGS[normalizedStatus] || STATUS_CONFIGS.open;
  };

  const navigateToIssueDetails = () => {
    navigate(`/adminDetails/${issue._id}`);
  };

  const renderPlaceholderImage = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-12 w-12 mb-2 text-gray-300" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1} 
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
        />
      </svg>
      <span className="text-sm">No Image</span>
    </div>
  );

  const statusConfig = getStatusConfig(issue.status);

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm overflow-hidden"
      whileHover={{ 
        scale: 1.015, 
        boxShadow: "0 10px 15px rgba(0, 0, 0, 0.05)" 
      }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
    >
      {/* Image Section */}
      <div 
        onClick={navigateToIssueDetails} 
        className="h-48 relative cursor-pointer group"
      >
        {issue.image ? (
          <img 
            src={issue.image} 
            alt={issue.title || "Issue image"} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          renderPlaceholderImage()
        )}
        
        <span 
          className={`
            absolute top-4 right-4 px-3 py-1 text-xs font-medium 
            rounded-full ${statusConfig.bgColor} ${statusConfig.textColor}
          `}
        >
          {issue.status || "Open"}
        </span>
      </div>

      {/* Content Section */}
      <div 
        onClick={navigateToIssueDetails} 
        className="p-6 space-y-3 cursor-pointer"
      >
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {issue.title || "Untitled Issue"}
        </h3>
        
        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-2 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {issue.name || "Anonymous"}
          </div>
          
          <div className="flex items-center truncate">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-2 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {issue.email || "No email"}
          </div>
          
          <div className="flex items-center truncate">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-2 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {`${issue.address || 'No address'}, ${issue.city || 'No city'}`}
          </div>
          
          <div className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-2 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(issue.createdAt || Date.now()).toLocaleDateString()}
          </div>
        </div>

        <p className="text-sm text-gray-700 line-clamp-2 mt-4">
          {issue.description || "No description provided"}
        </p>
      </div>

      {/* Status Change Section */}
      <div className="px-6 py-4 border-t border-gray-100">
        <select
          value={issue.status || "Open"}
          onChange={(e) => handleStatusChange(issue._id, e.target.value)}
          className={`
            w-full p-2 text-sm border rounded 
            ${statusConfig.textColor} 
            ${statusConfig.borderColor} 
            focus:ring-2 focus:ring-opacity-50 transition-all
          `}
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