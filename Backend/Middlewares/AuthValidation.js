const Joi = require("joi");

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        firstname: Joi.string().min(2).max(50).required(),
        lastname: Joi.string().min(2).max(50).required(),
        
        email: Joi.string().email().required(),
        
        password: Joi.string()
            .min(6) // Fixed: Changed from 4 to 6 (comment was saying 6 but code had 4)
            .max(100)
            .required(),
            
        confirmpassword: Joi.any()
            .valid(Joi.ref('password'))
            .required()
            .messages({
                'any.only': 'Passwords do not match'
            }),
            
        contact: Joi.string()
            .pattern(new RegExp("^[0-9]{10}$")) // Fixed: Changed from {1} to {10}
            .optional() // Make it optional since it might be empty
            .allow('', null) // Allow empty string or null
            .messages({
                'string.pattern.base': 'Contact must be a valid 10-digit number'
            }),
            
        address: Joi.string().min(5).max(200).required(),
        city: Joi.string().min(2).max(50).required(),
        role: Joi.string().valid("user", "admin").default("user")
    });

    const { error, value } = schema.validate(req.body, {
        abortEarly: false, // Show all validation errors, not just the first one
        stripUnknown: true // Remove any unknown fields
    });

    if (error) {
        // Return all validation errors
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ 
            success: false, 
            message: errorMessages.join(', '),
            errors: errorMessages
        });
    }

    // Store validated data in request object
    req.validatedData = value;
    next();
};
const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required(),
        role:Joi.string().valid("user", "admin").default("user")
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Bad request", error })
    }
    next();
}
const validateVote = (req, res, next) => {
    const schema = Joi.object({
        voteType: Joi.string().valid('upvote', 'downvote').required()
    });

    const { error } = schema.validate(req.body); // Changed from req.params to req.body
    if (error) {
        return res.status(400).json({ 
            success: false, 
            message: error.details[0].message 
        });
    }
    next();
};
module.exports = {
    signupValidation,
    loginValidation,
    validateVote
}
