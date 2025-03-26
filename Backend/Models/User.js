const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmpassword: { type: String, required: true }, // Ideally, hash before storing
    contact: { type: String },
    address: { type: String, required: true },
    city: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }, // Example of role management
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;

