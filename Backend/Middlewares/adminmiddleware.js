const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

// 🟢 Middleware to Verify JWT Tokenconst verifyToken = (req, res, next) => {
  const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ 
        success: false, 
        error: "Access denied, no token provided" 
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Verify if token contains required admin data
    if (!decoded.city || !decoded.department) {
      return res.status(401).json({ 
        success: false, 
        error: "Invalid admin token" 
      });
    }
    
    req.user = decoded;
    next();

  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ 
      success: false, 
      error: "Invalid or expired token" 
    });
  }
};


module.exports = { verifyToken };
