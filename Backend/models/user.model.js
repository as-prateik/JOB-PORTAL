const mongoose = require("mongoose");


 

const AppliedJobSchema = new mongoose.Schema({

  jobId: {

    type: String,


 

    required: true,

  },


 

  title: {

    type: String,


 

    required: true,

  },


 

  location: {

    type: String,


 

    required: true,

  },


 

  status: {

    type: String,


 

    enum: ["applied", "selected", "rejected"],


 

    default: "applied",

  },


 

  appliedAt: {

    type: Date,


 

    default: Date.now,

  },


 

  notification: {

    type: String,


 

    default: "",

  },

});


 

const UserSchema = new mongoose.Schema(

  {

    authId: {

      type: mongoose.Schema.Types.ObjectId,


 

      ref: "Auth",


 

      required: true,


 

      unique: true,

    },


 

    employeeId: {

      type: Number,


 

      required: true,


 

      unique: true,

    },


 

    name: {

      type: String,


 

      required: true,


 

      trim: true,

    },


 

    position: {

      type: String,


 

      enum: ["hr", "manager", "employee"],


 

      default: "employee",

    },


 

    role: {

      type: String,


 

      required: true,


 

      default: "System Engineer", // Default role for employees

    },


 

    username: {

      type: String,


 

      required: true,


 

      trim: true,


 

      lowercase: true,


 

      unique: true,

    },


 

    email: {

      type: String,


 

      required: true,


 

      trim: true,


 

      lowercase: true,


 

      unique: true,

    },


 

    phone: {

      type: String,


 

      default: "",

    },


 

    location: {

      type: String,


 

      default: "",

    },


 

    skills: {

      type: [String],


 

      default: [],

    },


 

    certifications: {

      type: [String],


 

      default: [],

    },


 

    resumeUrl: {

      type: String,


 

      default: "",

    },


 

    coverLetterUrl: {

      type: String,


 

      default: "",

    },


 

    profilePhotoUrl: {

      type: String,


 

      default: "",

    },


 

    appliedJobs: {

      type: [AppliedJobSchema],


 

      default: [],

    },


 

    reportsTo: {

      type: String,


 

      default: "None",

    },

  },

  { timestamps: true }

);


 

module.exports = mongoose.model("User", UserSchema);


 