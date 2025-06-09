const express = require("express");
const { 
    adminLogin, 
    adminRegister, 
    getUserIssueData, 
    getDetailsById, 
    updateIssueStatus, 
    getAcceptedIssues,
    getRejectedIssues,
    getCompletedIssues, 
} = require("../Controllers/adminController");
const { verifyToken } = require("../Middlewares/adminmiddleware");

const router = express.Router();

// 🟢 Public Routes (No authentication required)
router.post("/adminlogin", adminLogin);
router.post("/adminsignup", adminRegister);

// 🔒 Protected Routes (JWT authentication required)
router.get("/getUserIssueData", verifyToken, getUserIssueData);
router.get("/getIssueDataById/:id", verifyToken, getDetailsById);
router.put("/updateIssueStatus", verifyToken, updateIssueStatus);
router.get("/getAcceptedIssues", verifyToken, getAcceptedIssues);
router.get("/getRejectedIssues", verifyToken, getRejectedIssues);
router.get("/getCompletedIssues", verifyToken, getCompletedIssues);

module.exports = router;
