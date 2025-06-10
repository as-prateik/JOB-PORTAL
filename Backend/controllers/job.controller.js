const Job = require("../models/job.model");


 

const User = require("../models/user.model");


 

// Create a new job (Manager only)


 

exports.createJob = async (req, res) => {

  try {

    // console.log('Creating job with data:', req.body);


 

    const {

      title,

      description,

      department,

      skillsRequired,

      location,

      level,

      lastDate,

    } = req.body;


 

    if (!title || !description || !location || !lastDate) {

      return res.status(400).json({ message: "Missing required fields" });

    }


 

    function generateJobId() {

      return `JOB-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    }

    console.log("req.user in job controller apply jobs ",req.user);

    console.log("req.user in createjob is ", req.user);

   

    const job = new Job({

      jobId: generateJobId(), // Function to generate unique job ID


 

      title,


 

      description,


 

      department,


 

      skillsRequired,


 

      location,


 

      level,


 

      postedBy: req.user.employeeId,


 

      postedDate: new Date(),


 

      lastDate: new Date(lastDate),


 

      updatedAt: new Date(),


 

      isActive: true,


 

      applicants: [],

    });

    console.log("job in createJob",job);

   

    await job.save();


 

    res.status(201).json({ message: "Job created successfully", job });

  } catch (error) {

    res.status(500).json({ message: "Server error", error: error.message });

  }

};


 

// Update a job (Manager only)


 

exports.updateJob = async (req, res) => {

  try {

    const { jobId } = req.params;


 

    const updateData = req.body;


 

    const job = await Job.findById(jobId);


 

    if (!job) return res.status(404).json({ message: "Job not found" });


 

    if (job.postedBy.toString() !== req.user.userId) {

      return res

        .status(403)

        .json({ message: "You can only update your own job postings" });

    }


 

    Object.assign(job, updateData);


 

    job.updatedAt = new Date();


 

    await job.save();


 

    res.json({ message: "Job updated successfully", job });

  } catch (error) {

    res.status(500).json({ message: "Server error", error: error.message });

  }

};


 

// Delete a job (Manager only)


 

exports.deleteJob = async (req, res) => {

  try {

    const { jobId } = req.params;


 

    const job = await Job.findById(jobId);


 

    if (!job) return res.status(404).json({ message: "Job not found" });


 

    // console.log("job is ", job);


 

    // console.log("user is ", req.user);


 

    if (job.postedBy !== req.user.employeeId) {

      return res

        .status(403)

        .json({ message: "You can only delete your own job postings" });

    }


 

    await job.deleteOne();


 

    res.json({ message: "Job deleted successfully" });

  } catch (error) {

    res.status(500).json({ message: "Server error", error: error.message });

  }

};


 

// Get ranked (on demand) skills across all jobs


 

exports.getRankedSkills = async (req, res) => {

  try {

    const jobs = await Job.find({}, "skillsRequired");


 

    const skillCounts = {};


 

    jobs.forEach((job) => {

      (job.skillsRequired || []).forEach((skill) => {

        const normalized = skill.trim().toLowerCase();


 

        skillCounts[normalized] = (skillCounts[normalized] || 0) + 1;

      });

    });


 

    // Convert to array and sort by frequency


 

    const rankedSkills = Object.entries(skillCounts)


 

      .sort((a, b) => b[1] - a[1])


 

      .map(([skill, count]) => ({ skill, count }));

    console.log("ranked skills are", rankedSkills);

    res.json({ rankedSkills });

  } catch (error) {

    res.status(500).json({ message: "Server error", error: error.message });

  }

};


 

exports.getRankedCertifications = async (req, res) => {

  try {

    const jobs = await Job.find({}, "certificationsRequired");

    const certificationCounts = {};

    jobs.forEach((job) => {

      (job.certificationsRequired || []).forEach((certification) => {

        const normalized = certification.trim().toLowerCase();

        certificationCounts[normalized] =

          (certificationCounts[normalized] || 0) + 1;

      });

    });

    // Convert to array and sort by frequency

    const rankedCertifications = Object.entries(certificationCounts)

      .sort((a, b) => b[1] - a[1])

      .map(([certification, count]) => ({ certification, count }));

    console.log("ranked certifications are", rankedCertifications);


 

    res.json({ rankedCertifications });

  } catch (error) {

    res.status(500).json({ message: "Server error", error: error.message });

  }

};


 

// List jobs with optional filters (any authenticated user)


 

exports.listJobs = async (req, res) => {

  try {

    const { skills, location, minSalary, maxSalary, isActive } = req.query;


 

    // console.log("in list jobs");


 

    // Build filter query


 

    const filter = {};


 

    if (skills) filter.skillsRequired = { $all: skills.split(",") };


 

    if (location) filter.location = location;


 

    if (minSalary || maxSalary) {

      filter.salary = {};


 

      if (minSalary) filter.salary.$gte = Number(minSalary);


 

      if (maxSalary) filter.salary.$lte = Number(maxSalary);

    }


 

    if (isActive !== undefined) filter.isActive = isActive === "true";


 

    const jobs = await Job.find(filter).sort({ postedDate: -1 });


 

    // console.log("jobs in backend are", jobs);


 

    res.json({ jobs });

  } catch (error) {

    res.status(500).json({ message: "Server error", error: error.message });

  }

};


 

exports.myListedJobs = async (req, res) => {

  try {

    const employeeId = req.user.employeeId; // This should be the employeeId stored in postedBy

    console.log("req.user.userId in list my jobs",employeeId);

   

    const jobs = await Job.find({ postedBy: employeeId }).sort({

      postedDate: -1,

    });


 

    res.json({ jobs });

  } catch (error) {

    res.status(500).json({ message: "Server error", error: error.message });

  }

};


 

// Get job by custom jobId (public for authenticated users)


 

exports.getJobById = async (req, res) => {

  try {

    const { jobId } = req.params;


 

    // Use custom jobId field (not MongoDB _id)


 

    const job = await Job.findOne({ jobId });


 

    if (!job) {

      return res.status(404).json({ message: "Job not found" });

    }


 

    res.json({ job });

  } catch (error) {

    res.status(500).json({ message: "Server error", error: error.message });

  }

};


 

// exports.applyToJob = async (req, res) => {

//   try {

//     const { jobId } = req.params;

//     console.log(req.user);

//     const userId = req.user.userId;

//     console.log("user is applying to job", req.user);

//     // Find the job

//     const job = await Job.findById(jobId);

//     if (!job || !job.isActive) {

//       return res.status(404).json({ message: "Job not found or inactive" });

//     }

//     // Check if user already applied

//     console.log("applicants are",job.applicants);

//     console.log("userId in apply job is ",userId);

   

//     const alreadyApplied = job.applicants.some(

//       (applicant) => applicant._id.toString() === userId

//     );

//     if (alreadyApplied) {

//       return res

//         .status(400)

//         .json({ message: "You have already applied to this job" });

//     }

//     const user = await User.findOne({ authId: req.user.userId });

//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Add applicant snapshot to job

//     job.applicants.push({

//       userId: user.employeeId.toString(), // employeeId as string

//       name: user.name,

//       email: user.email,

//       role: user.role,

//       skills: user.skills,

//       certifications: user.certifications,

//       status: "applied",

//       appliedAt: new Date(),

//     });


 

//     await job.save();


 

//     // console.log("job after applying is", job);

//     // Also update user's appliedJobs

//     // Add job details to user's appliedJobs

//     user.appliedJobs.push({

//       jobId: job.jobId, // string

//       title: job.title,

//       location: job.location,

//       status: "applied",

//       appliedAt: new Date(),

//       notification: "Application received",

//     });

//     await user.save();

//     res.json({ message: "Application submitted successfully" });

//   } catch (error) {

//     console.error("Error applying to job:", error);

//     res.status(500).json({ message: "Server error", error: error.message });

//   }

// };


 

exports.applyToJob = async (req, res) => {

  try {

    const { jobId } = req.params;

    const authId = req.user.userId;


 

    // Find the job using MongoDB's _id

    const job = await Job.findById(jobId);

    if (!job || !job.isActive) {

      return res.status(404).json({ message: "Job not found or inactive" });

    }


 

    // ✅ Find user using authId (from token)

    const user = await User.findOne({ authId });

    if (!user) {

      return res.status(404).json({ message: "User not found" });

    }


 

    const employeeId = user.employeeId;


 

    // Check if user already applied

    console.log("Applicants are:", job.applicants);

    console.log("Employee ID is:", employeeId);


 

    const alreadyApplied = job.applicants.some(

      (applicant) => applicant.userId === employeeId

    );


 

    if (alreadyApplied) {

      return res.status(400).json({ message: "You have already applied to this job" });

    }


 

    // Add applicant snapshot to job

    const now = new Date();

    job.applicants.push({

      userId: employeeId,

      name: user.name,

      email: user.email,

      role: user.role,

      skills: user.skills,

      certifications: user.certifications,

      status: "applied",

      appliedAt: now,

    });


 

    await job.save();


 

    // Add job to user's appliedJobs

    user.appliedJobs.push({

      jobId: job.jobId, // this is the custom JOB-... ID

      title: job.title,

      location: job.location,

      status: "applied",

      appliedAt: now,

      notification: "Application received",

    });


 

    await user.save();


 

    res.json({ message: "Application submitted successfully" });

  } catch (error) {

    console.error("Error applying to job:", error);

    res.status(500).json({ message: "Server error", error: error.message });

  }

};



 

exports.withdrawApplication = async (req, res) => {

  try {

    const { jobId } = req.params;


 

    const userId = req.user.userId;


 

    // Find job by custom jobId field


 

    const job = await Job.findOne({ jobId });


 

    if (!job) {

      return res.status(404).json({ message: "Job not found" });

    }


 

    const user = await User.findOne({ authId: userId });


 

    if (!user) {

      return res.status(404).json({ message: "User profile not found" });

    }


 

    const employeeId = user.employeeId?.toString();


 

    // Check if the user has applied


 

    const hasApplied = job.applicants.some(

      (applicant) => applicant.userId.toString() === employeeId

    );


 

    if (!hasApplied) {

      return res

        .status(400)

        .json({ message: "You have not applied to this job" });

    }


 

    // Remove from job's applicant list


 

    job.applicants = job.applicants.filter(

      (applicant) => applicant.userId.toString() !== employeeId

    );


 

    await job.save();


 

    // Remove from user's appliedJobs list


 

    user.appliedJobs = user.appliedJobs.filter(

      (appliedJob) => appliedJob.jobId !== jobId

    );


 

    await user.save();


 

    res.json({ message: "Application withdrawn successfully" });

  } catch (error) {

    console.error("Error withdrawing application:", error);


 

    res.status(500).json({ message: "Server error", error: error.message });

  }

};


 

// View applicants for a job (Manager only)


 

exports.viewApplicants = async (req, res) => {

  try {

    const { jobId } = req.params;


 

    const job = await Job.findById(jobId);


 

    if (!job) return res.status(404).json({ message: "Job not found" });

    console.log("job is posted by",job.postedBy);

    console.log("req.user.employeeId is",req.user.employeeId);

   

   

    if (job.postedBy != req.user.employeeId) {

      return res

        .status(403)

        .json({ message: "You can only view applicants for your own jobs" });

    }


 

    res.json({ applicants: job.applicants });

  } catch (error) {

    res.status(500).json({ message: "Server error", error: error.message });

  }

};


 

exports.viewApplications = async (req, res) => {

  try {

    const userId = req.user.userId;


 

    const user = await User.findOne({ authId: userId }).populate({

      path: "appliedJobs.jobId",


 

      select: "title location",

    });


 

    if (!user) {

      return res.status(404).json({ message: "User not found" });

    }

    console.log("applied jobs are ", user.appliedJobs);


 

    res.json({ appliedJobs: user.appliedJobs });

  } catch (error) {

    res.status(500).json({ message: "Server error", error: error.message });

  }

};


 

exports.updateApplicantStatus = async (req, res) => {

  try {

    const { jobId, employeeId } = req.params;

    const { status } = req.body; // 'selected' | 'rejected'


 

    if (!['selected', 'rejected'].includes(status)) {

      return res.status(400).json({ message: "Invalid status" });

    }


 

    const job = await Job.findById(jobId);

    if (!job) return res.status(404).json({ message: "Job not found" });


 

    if (job.postedBy !== req.user.userId) {

      return res.status(403).json({ message: "Not authorized" });

    }


 

    const applicant = job.applicants.find(a => a.userId === employeeId);

    if (!applicant) {

      return res.status(404).json({ message: "Applicant not found for this job" });

    }


 

    applicant.status = status;

    await job.save();


 

    // Update user's appliedJobs too

    const user = await User.findOne({ employeeId: Number(employeeId) });

    if (user) {

      const app = user.appliedJobs.find(j => j.jobId === job.jobId);

      if (app) {

        app.status = status;

        app.notification = status === 'selected' ? 'Awaiting approval from your manager' : 'You were not selected';

        await user.save();

      }

    }


 

    res.json({ message: `Applicant ${status} successfully` });

  } catch (error) {

    res.status(500).json({ message: "Server error", error: error.message });

  }

};



 

exports.approveApplicantTransfer = async (req, res) => {

  try {

    const { jobId, employeeId } = req.params;


 

    const user = await User.findOne({ employeeId: Number(employeeId) });

    if (!user) return res.status(404).json({ message: "User not found" });


 

    if (user.reportsTo !== req.user.userId) {

      return res.status(403).json({ message: "You are not authorized to approve this transfer" });

    }


 

    const job = await Job.findOne({ jobId });

    if (!job) return res.status(404).json({ message: "Job not found" });


 

    const applicant = job.applicants.find(a => a.userId === employeeId);

    if (!applicant || applicant.status !== 'selected') {

      return res.status(400).json({ message: "Applicant not selected or not found" });

    }


 

    // Transfer ownership

    user.reportsTo = job.postedBy;

    await user.save();


 

    // Optionally notify user

    const appliedJob = user.appliedJobs.find(j => j.jobId === job.jobId);

    if (appliedJob) {

      appliedJob.notification = 'Transfer approved. New manager assigned.';

      await user.save();

    }


 

    res.json({ message: "Transfer approved. Employee now reports to new manager." });

  } catch (error) {

    res.status(500).json({ message: "Server error", error: error.message });

  }

};



 