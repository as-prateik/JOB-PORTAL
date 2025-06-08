const express = require('express');

const router = express.Router();

const userController = require('../controllers/user.controller');

const upload = require('../middleware/upload.middleware');


 

// Get user profile by authId (current logged-in user)

router.get('/profile',userController.getProfile);

router.get('/profile/:employeeId',userController.getProfileByEmployeeId);


 

// Update user profile fields (name, skills, certifications, etc.)

router.put('/profile',userController.updateProfile);

router.put('/profile/:employeeId',userController.updateProfileByEmployeeId);


 

// Upload profile photo, resume, cover letter (multipart/form-data)

router.post('/upload',upload.fields([

  { name: 'profilePhoto', maxCount: 1 },

  { name: 'resume', maxCount: 1 },

  { name: 'coverLetter', maxCount: 1 }

]), userController.uploadFiles);


 

// Route to get all applications submitted by the employee

router.get('/applications', userController.getEmployeeApplications);


 

module.exports = router;