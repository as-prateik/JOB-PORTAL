const mongoose = require('mongoose');


 

const ApplicantSchema = new mongoose.Schema({

  userId: {

    type: String, // employeeId

    required: true,

  },

  name: {

    type: String,

    required: true,

  },

  email: {

    type: String,

    required: true,

  },

  role: {

    type: String,

    required: true,

  },

  skills: {

    type: [String],

    default: [],

  },

  certifications: {

    type: [String],

    default: [],

  },

  status: {

    type: String,

    enum: ['applied', 'selected', 'rejected'],

    default: 'applied',

  },

  appliedAt: {

    type: Date,

    default: Date.now,

  },

});


 

const JobSchema = new mongoose.Schema({

  jobId: {

    type: String,

    required: true,

    unique: true

  },

  title: {

    type: String,

    required: true,

    trim: true,

  },

  description: {

    type: String,

    required: true,

  },

  skillsRequired: {

    type: [String],

    default: ['Not Applicable'],

  },

  certificationsRequired: {
    type: [String],

    default: ['Not Applicable'],
  },

  department:{

    type:String

  },

  location: {

    type: String,

  },

  Level: {

    type: String,

    default: 'Not Specified',

  },

  postedBy: {

    type: String, // Store employeeId as a string

    required: true,

  },

  postedDate: {

    type: Date,

    default: Date.now,

  },

  lastDate: {

    type: Date,

    required: true,

  },

  updatedAt: {

    type: Date,

    default: Date.now,

  },

  isActive: {

    type: Boolean,

    default: true,

  },

  applicants: {

    type: [ApplicantSchema],

    default: [],

  },

});


 

module.exports = mongoose.model('Job', JobSchema);