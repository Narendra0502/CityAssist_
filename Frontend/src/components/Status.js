import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Fetching } from "./Fetching";
import Card from "./Card";
import { useNavigate } from "react-router-dom";

const Status = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getComplaints = async () => {
      try {
        console.log("Fetching data from database...");
        const data = await Fetching();
        if (!data.success && data.message === "Please login to view complaints") {
          navigate("/login");
          return;
        }
        const uniqueComplaints = Array.from(
          new Map(data.data.map(item => [item._id, item])).values()
        );
        setComplaints(data.data || []);
        if (!data.success) {
          setError(data.message);
        }
      } catch (error) {
        setError("Failed to load complaints");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    getComplaints();
  },[navigate]);
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 pt-20">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-20"> {/* ADDED pt-20 TO FIX NAVBAR OVERLAP */}
      <motion.h1
        className="text-center text-3xl font-bold text-blue-600 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Complaint Status
      </motion.h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
 {complaints.length > 0 ? (
            <Card complaints={complaints} />
          ) : (
            <motion.h1
              className="text-center text-lg text-gray-700 col-span-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              No Complaints Available
            </motion.h1>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Status;
