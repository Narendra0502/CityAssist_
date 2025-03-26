const Joi = require("joi");

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        firstname: Joi.string().min(2).max(50).required(),
        lastname: Joi.string().min(2).max(50).required(),
        
        email: Joi.string().email().required(),
       
        password: Joi.string()
            .min(4) // Minimum 6 characters
            .max(100)
            .required(),
        confirmpassword: Joi.ref("password"),
        contact: Joi.string()
            .pattern(new RegExp("^[0-9]{1}$")) // Ensures exactly 10-digit phone number
            .message("Contact must be a valid 10-digit number")
            ,
        address: Joi.string().min(5).max(200).required(),
        city: Joi.string().min(2).max(50).required(),
        role: Joi.string().valid("user", "admin").default("user"), // Ensures only "user" or "admin"
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

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
module.exports = {
    signupValidation,
    loginValidation
}