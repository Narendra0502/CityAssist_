// import AdminRegistrationForm from "../Models/adminRegister";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const AdminRegistrationForm = require("../Models/adminRegister");
// import Issue from "../Models/Issue";
const Issue = require("../Models/Issue");
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

const getUserIssueData = async (req, res) => {
  try {
    const { city, department } = req.user;
    console.log("Admin details from token:", { city, department });

    // Validate admin credentials
    if (!city || !department) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid admin credentials" 
      });
    }

    const allData = await Issue.find({
      city: city,
      department: department
    });
    
    console.log(`Found ${allData.length} issues for ${department} in ${city}`);
    return res.status(200).json(allData);

  }  catch(error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error fetching data' 
    });
  }
};

const adminRegister = async (req, res) => {
  try {
    const {
      firstname,
      email,
      contact,
      address,
      city,
      department,
      password,
      confirmpassword,
      role
    } = req.body;
    
    // Log request for debugging
    console.log("Admin signup request received:", { firstname, email, department, city, role });

    if (password !== confirmpassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    // Validate all required fields
    if (!firstname || !email || !contact || !address || !city || !department || !password) {
      console.error("❌ Missing required fields in admin signup:", 
        { firstname, email, contact, address, city, department });
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    // Check if user already exists
    const existingUser = await AdminRegistrationForm.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new registration form with matched fields
    const newRegistrationForm = new AdminRegistrationForm({
      firstname,
      email,
      contact,
      address,
      city,
      department,
      password: hashedPassword,
      role
    });

    const savedUser = await newRegistrationForm.save();

    // Set session values
    const token = jwt.sign(
      { userId: savedUser._id, city: savedUser.city, department: savedUser.department, role: savedUser.role },
      process.env.JWT_SECRET || "yourSecretKey",
      { expiresIn: "7d" }
    );


    // Explicitly save the session and wait for it to complete
    // await new Promise((resolve, reject) => {
    //   req.session.save(err => {
    //     if (err) reject(err);
    //     else resolve();
    //   });
    // });

    console.log("Session after admin register:", token);

    res.status(201).json({ 
      message: 'Registration successful', 
      success: true, 
      token,
      user: {
        id: savedUser._id,
        firstname: savedUser.firstname,
        email: savedUser.email,
        city: savedUser.city,
        department: savedUser.department,
        role: savedUser.role
      }
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error registering admin user', 
      error: error.message 
    });
  }
}


const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await AdminRegistrationForm.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password for user:", user.email);
      return res.status(401).json({ message: "Invalid password" });
    }
    console.log("yaha aaya");
    
    const token = jwt.sign(
      {
        userId: user._id,
        city: user.city,
        department: user.department,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Admin logged in successfully:", user.email);

  
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};



const getDetailsById = async (req, res) => {
  try {
    const cardId = req.params.id;
    console.log("Fetching details for ID:", cardId);

    if (!cardId) {
      return res.status(400).json({ message: "ID parameter is required" });
    }

   
    const entry = await Issue.findById(cardId);
    console.log("Found entry:", entry ? true : false);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json(entry);
  } catch (error) {
    console.error("Error in getDetailsById:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }

};

const updateIssueStatus = async (req, res) => {
  const { issueId, status } = req.body;
  console.log("Received issueId:", issueId);
  console.log("Received status:", status);

  try {
    // Validate input
    if (!issueId || !status) {
      return res.status(400).json({ success: false, error: 'Missing issueId or status' });
    }

    // Allowed statuses
    const allowedStatuses = ["Pending", "Accepted", "Rejected", "Completed", "Hold"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}` });
    }

    // Prepare the update object
    const updateData = { status };

    // If the status is "Completed", update the CompleteDate field
    if (status === "Completed") {
      updateData.CompleteDate = new Date();
    }

    // Update the issue status in the database
    const updatedIssue = await Issue.findByIdAndUpdate(
      issueId,
      updateData,
      { new: true }
    );

    if (!updatedIssue) {
      return res.status(404).json({ success: false, error: 'Issue not found' });
    }

    // Send the updated issue back to the frontend
    res.status(200).json({ success: true, message: 'Issue status updated successfully', issue: updatedIssue });

  } catch (error) {
    console.error('Error updating issue status:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
const getAcceptedIssues = async (req, res) => {
  try {

    const { department: adminDepartment, city: adminCity } = req.user || {};
    if (!adminDepartment || !adminCity) {
      console.error("Missing required fields:", { adminDepartment, adminCity });
      return res.status(400).json({ 
        error: "Missing required authentication data",
        details: "Department and city are required" 
      });
    }
    const acceptedIssues = await Issue.find({
      city: adminCity,
      department: adminDepartment,
      status: "Accepted"
    });
    return res.status(200).json({
      success: true,
      count: acceptedIssues.length,
      data: acceptedIssues
    });

  } catch (error) {
    console.error("Error in getAcceptedIssues:", error);
    return res.status(500).json({ 
      success: false,
      error: "Internal server error",
      message: error.message 
    });
  }
};

const getRejectedIssues = async (req, res) => {
  try {

    const { department: adminDepartment, city: adminCity } = req.user || {};
    if (!adminDepartment || !adminCity) {
      console.error("Missing required fields:", { adminDepartment, adminCity });
      return res.status(400).json({ 
        error: "Missing required authentication data",
        details: "Department and city are required" 
      });
    }
    const RejectedIssues = await Issue.find({
      city: adminCity,
      department: adminDepartment,
      status: "Rejected"
    });
    return res.status(200).json({
      success: true,
      count: RejectedIssues.length,
      data: RejectedIssues
    });

  } catch (error) {
    console.error("Error in getRejectedIssues:", error);
    return res.status(500).json({ 
      success: false,
      error: "Internal server error",
      message: error.message 
    });
  }
};
const getCompletedIssues = async (req, res) => {
  try {

    const { department: adminDepartment, city: adminCity } = req.user || {};
    if (!adminDepartment || !adminCity) {
      console.error("Missing required fields:", { adminDepartment, adminCity });
      return res.status(400).json({ 
        error: "Missing required authentication data",
        details: "Department and city are required" 
      });
    }
    const CompletedIssues = await Issue.find({
      city: adminCity,
      department: adminDepartment,
      status: "Completed"
    });
    return res.status(200).json({
      success: true,
      count: CompletedIssues.length,
      data: CompletedIssues
    });

  } catch (error) {
    console.error("Error in getCompletedIssues:", error);
    return res.status(500).json({ 
      success: false,
      error: "Internal server error",
      message: error.message 
    });
  }
};


module.exports = { adminRegister, adminLogin, getUserIssueData, getDetailsById, 
  updateIssueStatus, getAcceptedIssues,getRejectedIssues,getCompletedIssues };
