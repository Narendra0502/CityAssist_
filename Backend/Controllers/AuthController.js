


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
            { expiresIn: "7d" } // Token expires in 7 days
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
            { email: user.email, _id: user._id, role: user.role },
            process.env.JWT_SECRET || "yourSecretKey",
            { expiresIn: '7d' }
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
            image:imageurl
        });

        
        res.status(201).json({ message: 'Issue created successfully', success: true, issue: newIssue });

    } catch (err) {
        console.error('Create Issue Error:', err);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};


const getAllIssues = async (req, res) => {
    try {
        console.log("Fetching issues email controller for user>>>:", req.user.email);
        if (!req.user || !req.user.email) {
            return res.status(400).json({ error: "email to reh hi gaya bhai picheee " });
        }
        const useremail=req.user.email;
        const data = await IssueModel.find({email:useremail});
        res.status(200).json({ success: true, data });
        console.log("get all the data>>>",data);
    } catch (err) {
        console.error("Error fetching controller main issues:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
        console.log("error in controller main fetching data>>>",err);
    }
};



module.exports={
    signup,
    login,
    createIssue,
    getAllIssues,
    
}