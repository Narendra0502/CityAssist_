import React from "react";
import { motion } from "framer-motion";
import Card from "./Card";

const CityUpdate = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-100 pt-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
          City Updates
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Top issues in your city sorted by community votes
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card />
      </motion.div>
    </div>
  );
};

export default CityUpdate;