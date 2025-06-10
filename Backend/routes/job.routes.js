const express = require("express");


 

const router = express.Router();


 

const jobController = require("../controllers/job.controller");


 

// Middleware to restrict access based on roles


 

const authorizeRoles =

  (...roles) =>

  (req, res, next) => {

    // console.log("req is", req);


 

    console.log("authorizing roles", roles);


 

    // Check if user is authenticated


 

    console.log("req.user is", req.user);


 

    if (!roles.includes(req.user.role)) {

      console.log("role is", req.user.role);


 

      return res

        .status(403)

        .json({ message: "Access denied: insufficient permissions" });

    }


 

    next();

  };


 

// Create a new job posting (Manager only)


 

router.post("/", authorizeRoles("manager"), jobController.createJob);


 

// Get ranked (on demand) skills


 

router.get("/on-demand-skills", jobController.getRankedSkills);


 

router.get("/on-demand-certifications",jobController.getRankedCertifications);


 

// Edit a job posting (Manager only)


 

router.put("/:jobId", authorizeRoles("manager", "hr"), jobController.updateJob);


 

// Delete a job posting (Manager only)


 

router.delete(

  "/:jobId",

  authorizeRoles("manager", "hr"),

  jobController.deleteJob

);


 

// List jobs with optional filters (any authenticated user)


 

router.get("/", jobController.listJobs);


 

// View jobs (for Managers to view their listed jobs )


 

router.get(

  "/my-listed-jobs",

  authorizeRoles("manager"),

  jobController.myListedJobs

);


 

// View applicants for a job (Manager only)


 

router.get(

  "/:jobId/applicants",

  authorizeRoles("manager", "hr"),

  jobController.viewApplicants

);


 

// Apply to a job (Employee only)


 

router.post(

  "/:jobId/apply",

  authorizeRoles("employee"),

  jobController.applyToJob

);


 

router.get("/:jobId", jobController.getJobById);


 

// View application status and notifications (Employee only)


 

router.get(

  "/applications/status",

  authorizeRoles("employee"),

  jobController.viewApplications

);


 

// Withdraw application route


 

// router.delete('/:jobId/withdraw', authorizeRoles('employee'), jobController.withdrawApplication);


 

router.delete(

  "/applications/:jobId/withdraw",

  authorizeRoles("employee"),

  jobController.withdrawApplication

);


 

router.patch('/jobs/:jobId/applicants/:employeeId/status', authorizeRoles("manager"), jobController.updateApplicantStatus);


 

router.patch('/jobs/:jobId/applicants/:employeeId/approve', authorizeRoles("manager"),jobController.approveApplicantTransfer);





 

module.exports = router;


 