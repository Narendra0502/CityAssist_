const { signup, login,createIssue} = require('../Controllers/AuthController');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');
const { upload }=require('../config/cloudinary');
const authMiddleware=require('../Middlewares/Auth');

const { getAllIssues }=require('../Controllers/AuthController');
console.log("inside auth router>>>>:",getAllIssues);

const router = require('express').Router();
router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.post('/Issues', upload.single('image'), createIssue);
router.get('/complain',authMiddleware,getAllIssues);




module.exports = router;