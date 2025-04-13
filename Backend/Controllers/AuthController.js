


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");
const IssueModel = require('../Models/Issue');
const dotenv = require("dotenv");

const signup = async (req, res) => {
    try {
        const { firstname, lastname, email, password, contact, address, city, role } = req.body;

        // Check if the user already exists
        if (!firstname || !lastname || !email || !password || !contact || !address || !city ||!role) {
            return res.status(400).json({ message: 'All fields are required' });
          }
        console.log("role is :>",role);
        const existingUser = await UserModel.findOne({ email });
        if (existingUser && existingUser.role === role) {
            return res.status(409).json({
                message: `User with email ${email} already exists as a ${role}. Please log in.`,
                success: false
            });
        }
        
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists, please log in.",
                success: false
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new UserModel({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            confirmpassword: hashedPassword,
            contact,
            address,
            city,
            role
        });

        await newUser.save();

        // Generate JWT Token
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET || "yourSecretKey",
            { expiresIn:"7d" } // 
        );

        res.status(201).json({
            message: "Signup successful",
            success: true,
            user: {
                id: newUser._id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                email: newUser.email,
                contact: newUser.contact,
                address: newUser.address,
                city: newUser.city,
                role: newUser.role
            },
            token
        });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({
            message: "kuch to gadbaad hai daya signup me",
            success: false
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password,role } = req.body;
        const user = await UserModel.findOne({ email });
        const errorMsg = 'Auth failed email or password is wrong';
        if (!user) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        if (user.role !== role) {
            return res.status(403).json({
                message: `Incorrect role. This email is registered as a ${user.role}.`,
                success: false
            });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id, role: user.role ,city:user.city},
            process.env.JWT_SECRET || "yourSecretKey",
    { 
        expiresIn: '7d', // Set to 7 days
        algorithm: 'HS256' // Specify algorithm
    }
        )
        console.log("Login Response for jwttoken:", { jwtToken, user });


        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                user: {
                    id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    contact: user.contact,
                    address: user.address,
                    city: user.city,
                    role: user.role
                }
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}


const createIssue = async (req, res) => {
    try {
        const { title, description, name,email, contact, address, city,department,latitude,longitude,
            status,reason,remark,CompleteDate,completefile

         } = req.body;
        // console.log(req.body);
        console.log("req.file is :>",req.file);
        const imageurl=req.file?req.file.path:null;
        console.log("imageurl is :>",imageurl);
        // if (!title || !description || !name || !contact ||!email || !address || !city || !options || !imageurl) {
        //     return res.status(400).json({ message: 'All fields are required' });
        // }
        
        const newIssue =await IssueModel.create({  
            name,
            title,
            contact,
            description,
            address,
            email,
            city,
            department,
            latitude,
            longitude,
            status:status || "Pending",
            reason,
        
            remark,
            CompleteDate,
            completefile,
            upvotes: 0,    
            downvotes: 0,
            votedBy: [],    
            votes: 0,
            priority: 0,
            image:imageurl
        });

        
        res.status(201).json({ message: 'Issue created successfully', success: true, issue: newIssue });

    } catch (err) {
        console.error('Create Issue Error:', err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};
const upvoteIssue = async (req, res) => {
    try {
        const { issueId } = req.params;
        const { voteType,upvotes } = req.body; // Add this line
        const userId = req.user._id; // From auth middleware

        const issue = await IssueModel.findById(issueId);
        if (!issue) {
            console.log("Issue not found in upvote");
            return res.status(404).json({ 
                success: false, 
                message: "Issue not found" 
            });
        }

        // Check if user has already voted
        const existingVoteIndex = issue.votedBy.findIndex(vote => 
            vote.userId.toString() === userId.toString()
        );

        if (existingVoteIndex>=0) {
            const existingVote = issue.votedBy[existingVoteIndex];
            if (existingVote.voteType === "upvote") {
                // Remove vote if already upvoted
                issue.upvotes = Math.max(0, issue.upvotes - 1);
                issue.votedBy.splice(existingVoteIndex, 1);
            } else {
                // Change downvote to upvote
                issue.upvotes = Math.max(0, issue.upvotes + 1);
                issue.upvotes += 1;
                existingVote.voteType = 'upvote';
            }
        } else {
            // Add new upvote
            issue.upvotes += 1;
            issue.votedBy.push({ userId, voteType: 'upvote' });
        }

        // Update priority based on total votes
        issue.priority = issue.upvotes - issue.downvotes;
        
        await issue.save();
        console.log("upvoted successfully"),  
        res.status(200).json({
            
            success: true,
            message: "Vote updated successfully",
            votes: issue.upvotes
        });
    } catch (error) {
        console.error("Upvote nahi hua error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update vote"
        });
    }
};

const downvoteIssue = async (req, res) => {
    try {
        const { issueId } = req.params;
        const { voteType,downvotes } = req.body; // Add this line
        const userId = req.user._id; // From auth middleware

        const issue = await IssueModel.findById(issueId);
        if (!issue) return res.status(404).json({ message: "Issue not found", success: false });
        const existingVoteIndex = issue.votedBy.findIndex(vote => 
            vote.userId.toString() === userId.toString()
        );
         if (existingVoteIndex >= 0) {
            const existingVote = issue.votedBy[existingVoteIndex];
            if (existingVote.voteType === 'downvote') {
                // Remove downvote
                issue.downvotes = Math.min(issue.downvotes + 1, issue.votedBy.length);
                issue.votedBy.splice(existingVoteIndex, 1);
            } else {
                // Change upvote to downvote
                issue.downvotes = Math.max(0, issue.downvotes - 1);
                existingVote.voteType = 'downvote';
            }
        } else {
            // Add new downvote if votes > 0
            if (issue.downvotes > 0) {
                issue.downvotes += 1;
                issue.votedBy.push({ userId, voteType: 'downvote' });
            }
        }
        //issue.votes -= 1;
        issue.priority = Math.max(0, issue.upvotes - issue.downvotes); // Prevent priority from going negative
        await issue.save();
       console.log("downvoted successfully");
        res.status(200).json({ message: "Downvote successful", success: true, votes: issue.downvotes });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

const getAllIssues = async (req, res) => {
    try {
        console.log("Fetching issues email controller for user>>>:", req.user.email);
        if (!req.user || !req.user.email) {
            return res.status(400).json({ error: "email to reh hi gaya bhai picheee " });
        }
        const useremail=req.user.email;
        const data = await IssueModel.find({ email: useremail }).sort({ priority: -1 });
        res.status(200).json({ success: true, data });
        console.log("get all the data in get isssues >>>",data);
    } catch (err) {
        console.error("Error fetching controller main issues:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
        console.log("error in controller main fetching data>>>",err);
    }
};
// Update the existing getPriorityIssues function
// Update getPriorityIssues to handle req and res
const getPriorityIssues = async (req, res) => {
    try {
        const issues = await IssueModel.find()
            .select('title description status upvotes downvotes priority image address city createdAt email votedBy')
            .sort({ priority: -1, createdAt: -1 })
            .limit(10);

        console.log("Retrieved priority issues:", issues);

        if (!issues || issues.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No issues found"
            });
        }

        // If user is authenticated, include their vote status
        const userId = req.user._id;
        const issuesWithVoteStatus = issues.map(issue => ({
            ...issue.toObject(),
            userVote: issue.votedBy.find(vote => 
                vote.userId.toString() === userId.toString()
            )?.voteType || null
        }));

        res.json({
            success: true,
            message: "City updates fetched successfully",
            issues: issuesWithVoteStatus
        });

    } catch (error) {
        console.error("Error in getPriorityIssues:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};



// Inside updateIssue function
const updateIssue = async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;

        // Add debug logs
        console.log('📝 Received update request:', {
            id,
            update,
            userEmail: req.user?.email
        });

        const updatedIssue = await Issue.findByIdAndUpdate(
            id,
            update,
            { new: true }
        ).populate('user', 'email name');

        if (!updatedIssue) {
            console.log('❌ Issue not found:', id);
            return res.status(404).json({ error: 'Issue not found' });
        }

        console.log('✅ Issue updated:', updatedIssue);

        // Send email notification
        const emailResult = await EmailService.sendStatusUpdateEmail(
            req.user.email || 'admin@cityassist.com',
            {
                email: updatedIssue.email,
                name: updatedIssue.name || 'User',
                title: updatedIssue.title,
                status: updatedIssue.status,
                department: updatedIssue.department,
                city: updatedIssue.city,
                reason: update.reason || '',
                remark: update.remark || ''
            }
        );

        console.log('📧 Email notification result:', emailResult);

        res.json({
            success: true,
            issue: updatedIssue,
            emailSent: emailResult.success,
            emailPreview: emailResult.previewUrl
        });

    } catch (error) {
        console.error('❌ Update failed:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports={
    signup,
    login,
    createIssue,
    getAllIssues,
    upvoteIssue,
    downvoteIssue,
    getPriorityIssues,
    updateIssue
    
}