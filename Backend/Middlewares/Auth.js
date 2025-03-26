const jwt = require("jsonwebtoken");
// const User = require("../models/User");
const User = require("../Models/User");

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Invalid token format" });
    }
   
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "yourSecretKey");
        console.log("Decoded token auth main  >>>>:", decoded);
        req.user = await User.findById(decoded._id).select("-password");

        if (!req.user) {
            return res.status(401).json({ error: "User not found." });
        }
        console.log("User authenticated:>>>    >", req.user);
        const tokenExp = decoded.exp * 1000; // Convert to milliseconds
        if (Date.now() >= tokenExp) {
            return res.status(401).json({ 
                success: false,
                error: "Token has expired" 
            });
        }

        next();
    } catch (error) {
        console.log("JWT verification auth ke andr failed>>>>   :", error.message);
        res.status(401).json({ 
            success: false,
            error: error.name === 'TokenExpiredError' 
                ? "Token has expired, please login again" 
                : "Invalid token" 
        });
    }
};

module.exports = authMiddleware;
