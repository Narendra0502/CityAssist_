import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from 'react-hot-toast';
import { AiOutlineLike, AiFillLike, AiOutlineDislike, AiFillDislike } from "react-icons/ai";

const Card = ({ complaints = [] }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [issues, setIssues] = useState(complaints);
  const [voteState, setVoteState] = useState({
    upvotes: 0,
    downvotes: 0,
    userVote: null,
    isVoting: false
  });


  useEffect(() => {
    if (complaints.length === 0) {
      fetchIssues();
    }
  }, []);

  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view issues');
        return;
      }

      const response = await fetch('http://localhost:5000/auth/update', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch issues');
      const data = await response.json();
      setIssues(data.issues.map(issue => ({
        ...issue,
        userVote: issue.userVote || null,
        upvotes: issue.upvotes || 0,
        downvotes: issue.downvotes || 0
      })));
    } catch (error) {
      console.error("Failed to fetch issues:", error);
      toast.error(error.message);
    }
  };

  const handleVote = async (issueId, voteType) => {
    if (voteState.isVoting) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to vote');
        return;
      }

      setVoteState(prev => ({ ...prev, isVoting: true }));

      // Find issue and update votes
      const currentIssue = issues.find(i => i._id === issueId);
      if (!currentIssue) return;

      const updatedIssues = issues.map(issue => {
        if (issue._id === issueId) {
          let newUpvotes = issue.upvotes || 0;
          let newDownvotes = issue.downvotes || 0;
          let newUserVote = issue.userVote;

          // Handle vote changes
          if (voteType === 'upvote') {
            if (issue.userVote === 'upvote') {
              // If already upvoted, remove upvote
              newUpvotes--;
              newUserVote = null;
            } else {
              // Add new upvote
              newUpvotes++;
              // If previously downvoted, remove downvote
              if (issue.userVote === 'downvote') {
                newDownvotes--;
              }
              newUserVote = 'upvote';
            }
          } else if (voteType === 'downvote') {
            if (issue.userVote === 'downvote') {
              // If already downvoted, remove downvote
              newDownvotes--;
              newUserVote = null;
            } else {
              // Add new downvote
              newDownvotes++;
              // If previously upvoted, remove upvote
              if (issue.userVote === 'upvote') {
                newUpvotes--;
              }
              newUserVote = 'downvote';
            }
          }
        
          return {
            ...issue,
            upvotes: Math.max(0, newUpvotes),
            downvotes: Math.max(0, newDownvotes),
            userVote: voteType
          };
        }
        return issue;
      });

      // Update local state first
      setIssues(updatedIssues);

      // Update in database
      const issueToUpdate = updatedIssues.find(i => i._id === issueId);
      const response = await fetch(`http://localhost:5000/auth/issues/${issueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          upvotes: issueToUpdate.upvotes,
          downvotes: issueToUpdate.downvotes,
          priority: issueToUpdate.priority
        })
      });

      if (!response.ok) throw new Error('Failed to update vote');
      toast.success('Vote updated successfully');

    } catch (error) {
      console.error("Vote failed:", error);
      toast.error(error.message);
      // Rollback by refetching
      fetchIssues();
    } finally {
      setVoteState(prev => ({ ...prev, isVoting: false }));
    }
  };

  // Keep your existing status colors, progress bar width and messages objects
  const statusColors = {
    pending: "text-gray-600",
    accepted: "text-blue-600",
    rejected: "text-red-600",
    hold: "text-yellow-600",
    completed: "text-green-600",
  };

  const progressBarWidth = {
    pending: "0%",
    accepted: "50%",
    hold: "50%",
    completed: "100%",
  };

  return (
    <>
      {issues.map(issue => (
        <motion.div
          key={issue._id}
          className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03 }}
        >
          {/* Keep your existing JSX structure, just update the data source from 'complain' to 'issue' */}
          <div className="h-48 overflow-hidden">
            <img src={issue.image} alt="Issue" className="w-full h-full object-cover" />
          </div>

          <div className="p-5">
            <h2 className="text-xl font-bold text-gray-800">{issue.title}</h2>
            <p className="text-sm text-gray-600 mt-2">{issue.description}</p>
            <p className="text-sm text-gray-500 mt-1">
              <strong>Location:</strong> {issue.address}, {issue.city}
            </p>

            {/* Status Display */}
            <div className="mt-3">
              <p className="font-semibold">
                <strong>Status: </strong>
                <span className={`${statusColors[issue.status?.toLowerCase()] || "text-gray-600"}`}>
                  {issue.status ? issue.status.charAt(0).toUpperCase() + issue.status.slice(1) : "Pending"}
                </span>
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 bg-gray-300 w-full h-2 rounded-full relative">
              <motion.div
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: progressBarWidth[issue.status?.toLowerCase()] || "0%" }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>

            {/* Vote Buttons */}
            <div className="mt-4 flex items-center justify-center space-x-6">
              <button
                onClick={() => handleVote(issue._id, 'upvote')}
                disabled={voteState.isVoting}
                className={`flex items-center space-x-2 ${
                  issue.userVote === 'upvote' ? 'text-blue-600' : 'text-gray-500'
                } ${voteState.isVoting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'} transition-all`}
              >
                {issue.userVote === 'upvote' ? <AiFillLike size={24} /> : <AiOutlineLike size={24} />}
                <span className="font-medium">{issue.upvotes || 0}</span>
              </button>

              <button
                onClick={() => handleVote(issue._id, 'downvote')}
                disabled={voteState.isVoting}
                className={`flex items-center space-x-2 ${
                  issue.userVote === 'downvote' ? 'text-red-600' : 'text-gray-500'
                } ${voteState.isVoting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'} transition-all`}
              >
                {issue.userVote === 'downvote' ? <AiFillDislike size={24} /> : <AiOutlineDislike size={24} />}
                <span className="font-medium">{issue.downvotes || 0}</span>
              </button>
            </div>

            {/* Rest of your existing JSX structure */}
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default Card;