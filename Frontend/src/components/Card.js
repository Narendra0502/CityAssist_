import React, { useState } from "react";
import { motion } from "framer-motion";

const Card = ({ complain }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!complain) {
    return <p className="text-gray-500 text-center">No complaint found.</p>;
  }

  // Status Colors
  const statusColors = {
    pending: "text-gray-600",
    accepted: "text-blue-600",
    rejected: "text-red-600",
    hold: "text-yellow-600",
    completed: "text-green-600",
  };

  // Progress Bar Width
  const progressBarWidth = {
    pending: "0%",
    accepted: "50%",
    hold: "50%",
    completed: "100%",
  };

  // Status Messages
  const statusMessages = {
    pending: "Your issue is pending and will be processed soon.",
    accepted: "Your issue is accepted. We are working on it.",
    hold: `Your issue is currently on hold. Reason: ${complain.reason || "Not specified"}`,
    rejected: `Your issue has been rejected. Reason: ${complain.reason || "Not specified"}`,
    completed: "Your issue has been resolved successfully.",
  };

  return (
    <motion.div
      className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
    >
      {/* Image Section */}
      <div className="h-48 overflow-hidden">
        <img
          src={complain.image}
          alt="Complaint"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-800">{complain.title}</h2>
        <p className="text-sm text-gray-600 mt-2">{complain.description}</p>
        <p className="text-sm text-gray-500 mt-1">
          <strong>Location:</strong> {complain.address}, {complain.city}
        </p>

        {/* Status Display */}
        <div className="mt-3">
          <p className="font-semibold">
            <strong>Status: </strong>
            <span
              className={`${statusColors[complain.status?.toLowerCase()] || "text-gray-600"}`}
            >
              {complain.status ? complain.status.charAt(0).toUpperCase() + complain.status.slice(1) : "Pending"}
            </span>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 bg-gray-300 w-full h-2 rounded-full relative">
          <motion.div
            className="bg-blue-500 h-2 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: progressBarWidth[complain.status?.toLowerCase()] || "0%" }}
            transition={{ duration: 0.5 }}
          ></motion.div>
        </div>

        {/* Expandable Details Section */}
        {showDetails && (
          <motion.div
            className="bg-gray-100 p-4 mt-3 rounded-md shadow-inner"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {/* Status Message */}
            <p className={`font-semibold ${statusColors[complain.status?.toLowerCase()]}`}>
              {statusMessages[complain.status?.toLowerCase()] || "Status not available."}
            </p>

            {/* Additional Information for Completed Status */}
            {complain.status?.toLowerCase() === "completed" && (
              <>
                <p className="text-green-600">
                  <strong>Remark:</strong> {complain.remark || "No remarks provided"}
                </p>
                <p className="text-blue-600">
                  <strong>Completed Date:</strong>{" "}
                  {complain.CompleteDate
                    ? new Date(complain.CompleteDate).toLocaleDateString()
                    : "N/A"}
                </p>
                {complain.completefile && (
                  <p>
                    <strong>Completion File:</strong>{" "}
                    <a
                      href={complain.completefile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline ml-1"
                    >
                      View File
                    </a>
                  </p>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          {showDetails ? "Hide Details" : "View Details"}
        </button>
      </div>
    </motion.div>
  );
};

export default Card;
