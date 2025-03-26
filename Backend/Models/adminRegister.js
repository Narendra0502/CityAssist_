const mongoose = require('mongoose');

const registrationFormSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    contact: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,

    }
}, {
    validateBeforeSave: false,
    timestamps: true 
}); 

const AdminRegistrationForm = mongoose.model('AdminRegistrationForm', registrationFormSchema);

module.exports = AdminRegistrationForm;
