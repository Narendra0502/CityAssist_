const express = require("express");
const { 
    signup, 
    login, 
    createIssue, 
    getAllIssues, 
    updateIssue, 
    upvoteIssue,
    downvoteIssue,
    getPriorityIssues
} = require("../Controllers/AuthController");
const IssueModel = require("../Models/Issue"); // Add this line
const { signupValidation, loginValidation, validateVote } = require("../Middlewares/AuthValidation");
const { upload } = require("../config/cloudinary");  
const authMiddleware = require("../Middlewares/Auth");
const router = express.Router();

// User authentication routes
router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);

// Issue reporting & retrieval
router.post("/issues", authMiddleware, upload.single("image"), createIssue);
router.get("/complain", authMiddleware, getAllIssues);
router.put("/issues/:id", authMiddleware, updateIssue); 
// Vote routes
// Combine both vote operations under a single route
router.put("/issuesvote/:issueId", authMiddleware, async (req, res) => {
    try {
        const { voteType } = req.body;
        console.log('Vote request received:', { issueId: req.params.issueId, voteType, userId: req.user._id });
        
        if (voteType === 'upvote') {
            await upvoteIssue(req, res);
        } else if (voteType === 'downvote') {
            await downvoteIssue(req, res);
        } else {
            await updateIssue(req, res);
        }
    } catch (error) {
        console.error('Vote error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to process vote",
            error: error.message
        });
    }
});
//     try {
//         const { issueId } = req.params;
//         const { voteType } = req.body;
//         const userId = req.user._id;

//         console.log('Vote request:', { issueId, voteType, userId }); // Add this

//         const issue = await IssueModel.findById(issueId);
//         if (!issue) {
//             console.log('Issue not found:', issueId); // Add this
//             return res.status(404).json({ 
//                 success: false, 
//                 message: "Issue not found" 
//             });
//         }

//         // ...rest of the vote handling code...

//     } catch (error) {
//         console.error('Vote error details:', { 
//             message: error.message, 
//             stack: error.stack 
//         }); // Add this
//         res.status(500).json({ 
//             success: false, 
//             message: "Failed to update vote",
//             error: error.message // Add error message to response
//         });
//     }
// });

// Get high-priority issues for city updates
router.get("/update", authMiddleware,getPriorityIssues);
//  async (req, res) => {
//     try {
//         const issues = await getPriorityIssues();
//         console.log("Issues to send:", issues);
        
//         if (!issues || issues.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No issues found"
//             });
//         }

//         res.json({
//             success: true,
//             message: "City updates fetched successfully",
//             issues: issues
//         });
//     } catch (error) {
//         console.error("Error fetching city updates:", error);
//         res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//             error: error.message
//         });
//     }
// });

// Export router
module.exports = router;
