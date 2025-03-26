import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AdminIssueDetails = () => {
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const navigate = useNavigate();
  const { id } = useParams();
  
  useEffect(() => {
    const fetchIssueDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found");
        }
        setLoading(true);

        const response = await fetch(`http://localhost:5000/admin/getIssueDataById/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('Received data in issue details:', data);
        
        // Verify that data is a single object, not an array
        if (Array.isArray(data)) {
          throw new Error('Received multiple entries instead of a single entry');
        }
        
        setIssue(data);
      } catch (error) {
        console.error('Error fetching issue details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (id) {
      fetchIssueDetails();
    }
  }, [id]);
  const handleStatusUpdate = async (newStatus) => {
    try {
      setActionInProgress(true);
        console.log("Updating status to:", newStatus);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token missing");
        setActionInProgress(false);
        return;
      }
      
      const response = await fetch(`http://localhost:5000/admin/updateIssueStatus`, {
        
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          issueId: id,
          status: newStatus
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Update local state with new status
      setIssue(prev => ({...prev, status: newStatus}));
      setSuccessMessage(`Issue successfully ${newStatus.toLowerCase()}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      setActionInProgress(false);
    } catch (error) {
      console.error(`Error ${newStatus.toLowerCase()}ing issue:`, error);
      setError(`Failed to ${newStatus.toLowerCase()} issue. Please try again.`);
      setActionInProgress(false);
    }
  };

  const handleAccept = () => handleStatusUpdate('Accepted');
  const handleReject = () => handleStatusUpdate('Rejected');
  const handleResolve = () => handleStatusUpdate('Completed');
  
  const getStatusClass = (status) => {
    if (!status) return 'bg-gray-500';
    
    switch(status.toLowerCase()) {
      case 'open':
        return 'bg-red-500';
      case 'in progress':
      case 'inprogress':
        return 'bg-orange-500';
      case 'resolved':
        return 'bg-green-500';
      case 'accepted':
        return 'bg-blue-500';
      case 'rejected':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Unknown date';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar placeholder - you may want to import your actual sidebar component */}
        <aside className="bg-teal-800 text-white w-64 p-0 hidden md:block">
          <nav className="py-8">
            <ul>
              <li className="mb-2">
                <a href="#" className="flex items-center px-8 py-4 bg-teal-700 text-white hover:bg-teal-700/50 transition-colors">
                  <i className="fas fa-ticket-alt w-5 mr-4 text-center"></i> Issues Management
                </a>
              </li>
              {/* Other sidebar items */}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          {/* Navigation and Back Button */}
          <div className="mb-6 flex items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center text-teal-800 hover:text-teal-600 transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i> Back to Issues
            </button>
          </div>

          {/* Page Title */}
          <h1 className="text-2xl font-semibold text-teal-800 mb-8">Issue Details</h1>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-teal-800 rounded-full animate-spin mb-4"></div>
              <p>Loading issue details...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <i className="fas fa-exclamation-circle text-5xl text-red-500 mb-4"></i>
              <p className="mb-4 text-red-500">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-teal-800 text-white px-6 py-2 rounded-md"
              >
                Try Again
              </button>
            </div>
          ) : issue ? (
            <>
              {/* Success message */}
              {successMessage && (
                <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 flex items-center justify-between">
                  <span>{successMessage}</span>
                  <button onClick={() => setSuccessMessage(null)} className="text-green-700">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Issue Header with Status */}
                <div className="relative">
                  {issue.image ? (
                    <div className="h-64 md:h-80">
                      <img src={issue.image} alt={issue.title || 'Issue image'} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-40 w-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                      <i className="fas fa-image text-6xl mb-2"></i>
                      <span>No Image Available</span>
                    </div>
                  )}
                  <span className={`absolute top-4 right-4 px-4 py-2 text-sm font-medium rounded-full text-white ${getStatusClass(issue.status || 'Open')}`}>
                    {issue.status || 'Open'}
                  </span>
                </div>
                
                {/* Main Content */}
                <div className="p-8">
                  {/* Title and Meta Information */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-teal-900 mb-4">{issue.title || 'Untitled Issue'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium text-gray-700">Reported By:</span> {issue.name || 'Anonymous'}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium text-gray-700">Email:</span> {issue.email || 'No email provided'}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium text-gray-700">Phone:</span> {issue.phone || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium text-gray-700">Location:</span> {issue.address || 'No address'}, {issue.city || 'No city'}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium text-gray-700">Reported On:</span> {formatDate(issue.createdAt || issue.date)}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium text-gray-700">Issue ID:</span> {issue._id}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-teal-800 mb-3">Description</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-gray-700 whitespace-pre-line">{issue.description || 'No description provided'}</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-semibold text-teal-800 mb-4">Actions</h3>
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={handleAccept}
                        disabled={actionInProgress || issue.status === 'Accepted'}
                        className={`px-6 py-3 rounded-md text-white font-medium flex items-center ${
                          actionInProgress || issue.status === 'Accepted' 
                            ? 'bg-blue-300 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {actionInProgress ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-check mr-2"></i>
                            Accept Issue
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={handleReject}
                        disabled={actionInProgress || issue.status === 'Rejected'}
                        className={`px-6 py-3 rounded-md text-white font-medium flex items-center ${
                          actionInProgress || issue.status === 'Rejected'
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gray-700 hover:bg-gray-800'
                        }`}
                      >
                        <i className="fas fa-times mr-2"></i>
                        Reject Issue
                      </button>
                      
                      <button
                        onClick={handleResolve}
                        disabled={actionInProgress || issue.status === 'Completed'}
                        className={`px-6 py-3 rounded-md text-white font-medium flex items-center ${
                          actionInProgress || issue.status === 'Completed'
                            ? 'bg-green-300 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        <i className="fas fa-check-double mr-2"></i>
                        Mark as Resolved
                      </button>
                    </div>
                  </div>
                  
                  {/* History Section - This would pull from an actual history if available */}
                  <div className="border-t border-gray-100 mt-8 pt-6">
                    <h3 className="text-lg font-semibold text-teal-800 mb-4">Issue History</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 mr-3"></div>
                        <div>
                        <p className="text-sm font-medium">{formatDate(issue.createdAt || issue.date)}</p>
                        <p className="text-gray-600">Issue was reported by {issue.name || 'Anonymous'}</p>
                        </div>
                      </div>
                      
                      {issue.status && issue.status !== 'Open' && (
                        <div className="flex items-start">
                          <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 mr-3"></div>
                          <div>
                            <p className="text-sm font-medium">Status Update</p>
                            <p className="text-gray-600">Issue status set to: {issue.status}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <i className="fas fa-search text-5xl text-gray-400 mb-4"></i>
              <p className="text-gray-600">Issue not found</p>
              <button 
                onClick={() => navigate(-1)}
                className="mt-4 bg-teal-800 text-white px-6 py-2 rounded-md"
              >
                Go Back
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminIssueDetails;