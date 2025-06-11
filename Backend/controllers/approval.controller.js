const TransferApproval = require("../models/transferApproval.model");

const User = require("../models/user.model");

const Job = require("../models/job.model");

function generateRequestId() {
  return `TRF-${Date.now()}-${Math.floor(1000 + Math.random() * 7000)}`;
}

// Create a transfer approval request

exports.createTransferApproval = async (req, res) => {
  try {
    const { employeeId, jobId } = req.body;

    console.log("request is ", req.body);

    const user = await User.findOne({ employeeId: employeeId });

    console.log("user is", user);

    const requestId = generateRequestId();

    const toManagerusername = await User.findOne({
      employeeId: employeeId,
    }).then((user) => user.reportsTo); // Get the new manager's ID from the employee's reportsTo field

    if (!toManagerusername) {
      return res
        .status(400)
        .json({ error: "Employee reportsTo field not found" });
    }

    toManager = await User.findOne({ username: toManagerusername });

    toManagerId = toManager.employeeId;

    const fromManagerId = req.user.employeeId; // Get the current manager's ID from the authenticated user

    if (!employeeId || !toManagerId || !jobId || !fromManagerId) {
      console.log(
        "required fields",
        employeeId,
        toManagerId,
        jobId,
        fromManagerId
      );

      return res.status(400).json({ error: "Missing required fields" });
    }

    const approval = await TransferApproval.create({
      requestId,

      employeeId,

      fromManagerId,

      toManagerId,

      jobId,

      status: "pending",
    });

    console.log("approval is ", approval);

    res.status(201).json(approval);
  } catch (err) {
    console.log("Error creating approval request:", err);

    res.status(500).json({ error: "Failed to create approval request" });
  }
};

// Get pending approvals for a manager

exports.getPendingApprovals = async (req, res) => {
  try {
    console.log(req.user);

    const managerUserName = req.user.username;

    const toManagerId = await User.findOne({ username: managerUserName });

    console.log("toManagerId", toManagerId.employeeId);

    empid = req.user.employeeId;

    let c = await TransferApproval.find({ toManagerId: empid });

    console.log("all approvals are ", c);

    const approvals = await TransferApproval.find({
      toManagerId: empid,

      status: "pending",
    });

    console.log("approvals are", approvals);

    res.status(200).json(approvals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch approvals" });
  }
};

// Approve or reject a transfer

// exports.updateApprovalStatus = async (req, res) => {
//   try {
//     console.log("in update approval status");

//     const { requestId, status } = req.body;

//     console.log("requestId is ", requestId, " status is ", status);
//     if (!requestId || !status) {
//       return res.status(400).json({ error: "Missing requestId or status" });
//     }

//     // Find the approval request by jobId

//     const approval = await TransferApproval.findOne({ requestId });
//     //  const approval = await TransferApproval.findById(jobId);

//     if (!approval) {
//       return res
//         .status(404)
//         .json({ error: "Approval with requestId not found" });
//     }

//     // console.log("current user:-",req.user," employee manager:- ", approval);

//     // Check if the logged-in user is the toManager

//     if (req.user.employeeId != approval.toManagerId) {
//       return res
//         .status(403)
//         .json({ error: "Not authorized to perform this action" });
//     }

//     // Update the approval status

//     approval.status = status;

//     console.log("approval before saving", approval);

//     await approval.save();

//     let x = await TransferApproval.findOne({ requestId });

//     console.log("approval after saving", x);

//     // If approved, update the applicant's reportsTo field

//     if (status === "approved") {
//       fromManager = await User.findOne({ employeeId: approval.fromManagerId });

//       console.log("to manager username is ", fromManager.username);

//       const updatedUser = await User.findOneAndUpdate(
//         { employeeId: approval.employeeId },

//         { reportsTo: fromManager.username },

//         { new: true }
//       );

//       if (!updatedUser) {
//         return res
//           .status(404)
//           .json({ error: "Employee not found to update reportsTo" });
//       }
//     }

//     const updatedemployee = await User.findOne({
//       employeeId: approval.employeeId,
//     });

//     console.log("updated employeeId is ", updatedemployee);

//     const job = await Job.findById(approval.jobId);
//     const jobId = job?.jobId;

//     if (!jobId) {
//       return res.status(404).json({ error: "Job not found for this approval" });
//     }

//     if (status === "approved") {
//       const updatedApplication = await User.findOneAndUpdate(
//         {
//           employeeId: approval.employeeId,
//           "appliedJobs.jobId": jobId,
//         },
//         {
//           $set: {
//             "appliedJobs.$.status": "Selected",
//             "appliedJobs.$.notification":
//               "You have been selected and transfer approved",
//           },
//         },
//         { new: true }
//       );

//       if (!updatedApplication) {
//         console.warn("No job application found to update for transfer.");
//       } else {
//         console.log("Updated application:", updatedApplication);
//       }
//     } else {
//       console.log("not approved");
//     }

//     res.status(200).json(approval);
//   } catch (err) {
//     console.log("Error updating approval status:", err);

//     res.status(500).json({ error: "Failed to update approval status" });
//   }
// };

exports.updateApprovalStatus = async (req, res) => {
  try {
    console.log("in update approval status");

    const { requestId, status } = req.body;

    console.log("requestId is ", requestId, " status is ", status);
    if (!requestId || !status) {
      return res.status(400).json({ error: "Missing requestId or status" });
    }

    const approval = await TransferApproval.findOne({ requestId });

    if (!approval) {
      return res
        .status(404)
        .json({ error: "Approval with requestId not found" });
    }

    if (req.user.employeeId != approval.toManagerId) {
      return res
        .status(403)
        .json({ error: "Not authorized to perform this action" });
    }

    approval.status = status;
    await approval.save();

    console.log("✅ Approval saved:", approval);

    if (status === "approved") {
      const fromManager = await User.findOne({
        employeeId: approval.fromManagerId,
      });

      if (!fromManager) {
        return res.status(404).json({ error: "From manager not found" });
      }

      const updatedUser = await User.findOneAndUpdate(
        { employeeId: approval.employeeId },
        { reportsTo: fromManager.username },
        { new: true }
      );

      if (!updatedUser) {
        return res
          .status(404)
          .json({ error: "Employee not found to update reportsTo" });
      }

      console.log("✅ Updated employee reportsTo:", updatedUser.username);
    }

    const updatedemployee = await User.findOne({
      employeeId: approval.employeeId,
    });
    console.log("updated employeeId is ", updatedemployee);

    const job = await Job.findById(approval.jobId);
    const jobId = job?.jobId;

    if (!jobId) {
      return res.status(404).json({ error: "Job not found for this approval" });
    }

    if (status === "approved") {
      const updatedApplication = await User.findOneAndUpdate(
        {
          employeeId: approval.employeeId,
          "appliedJobs.jobId": jobId,
        },
        {
          $set: {
            "appliedJobs.$.status": "Selected",
            "appliedJobs.$.notification":
              "You have been selected and transfer approved",
          },
        },
        { new: true }
      );

      if (!updatedApplication) {
        console.warn("⚠️ No job application found to update for transfer.");
      } else {
        console.log("✅ Updated User.appliedJobs");
      }

      // ✅ Update Job.applicants[].status
      const updatedJob = await Job.findOneAndUpdate(
        {
          _id: approval.jobId,
          "applicants.userId": approval.employeeId.toString(),
        },
        {
          $set: {
            "applicants.$.status": "Selected",
          },
        },
        { new: true }
      );

      if (!updatedJob) {
        console.warn("⚠️ Job record or applicant not found to update.");
      } else {
        console.log("✅ Job.applicants updated.");
      }
    } else {
      console.log("ℹ️ Not approved, skipping user/job updates.");
    }

    res.status(200).json(approval);
  } catch (err) {
    console.log("❌ Error updating approval status:", err);
    res.status(500).json({ error: "Failed to update approval status" });
  }
};
