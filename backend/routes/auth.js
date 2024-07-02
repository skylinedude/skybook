const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser= require('../middleware/fetchuser')

const JWT_SECRET = process.env.JWT_SECRET || 'SKYLINEDUDE';

const router = express.Router();

//Route 1:  Creating user using POST: '/api/auth/createUser', no login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter valid password').isLength({ min: 5 })
], async (req, res) => {
    // If error occurs, show the errors
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Check if user with same email exists
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(409).json({success, error: 'Sorry, the user already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });

        const payload = {
            user: {
                id: user.id
            }
        };

        const authToken = jwt.sign(payload, JWT_SECRET);
        success=true;
        res.json({success, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error occurred');
    }
});

//Route 2: Authenticate user using POST: '/api/auth/login', no login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    // If error occurs, show the errors
    let   success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Incorrect email address or password' });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success=false;
            return res.status(400).json({success, error: 'Incorrect email address or password' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        const authToken = jwt.sign(payload, JWT_SECRET);
        success=true;
        res.json({success, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal server error occurred');
    }
});
//Route 2: get logged in user details using POST: '/api/auth/getuser',  login required
router.post('/getuser',fetchuser,async (req, res) => {
try {
    const userId=req.user.id
    const user= await User.findById(userId).select('-password')
    res.send(user)
} catch (error) {
    console.error(error.message);
    res.status(500).send('Internal server error occurred');
}
})
module.exports = router;
