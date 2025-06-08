const express = require('express');

const router = express.Router();

const {verifyJWT} = require('../middleware/auth.middleware')


 

const { registerUser, loginUser } = require('../controllers/auth.controller');

const { changePassword } = require('../controllers/auth.controller');


 

function requireHR(req, res, next) {

    if (req.user && req.user.role === 'hr') {

        next();

    } else {

        return res.status(403).json({ message: 'Only HR can register users.' });

    }

}


 

router.post('/register',verifyJWT, requireHR,registerUser);

// router.post('/register',registerUser);

router.post('/login', loginUser);


 

// Change password (JWT protected)

router.post('/change-password', verifyJWT, changePassword);



 

module.exports = router;

