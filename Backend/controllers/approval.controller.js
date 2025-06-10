const TransferApproval = require("../models/transferApproval.model");
const User = require("../models/user.model");



// Create a transfer approval request
exports.createTransferApproval = async (req, res) => {
  try {
    const { employeeId, jobId } = req.body;
    const toManagerId = User.findOne({ employeeId: employeeId }).then(user => user.reportsTo); // Get the new manager's ID from the employee's reportsTo field
    if (!toManagerId) {
      return res.status(400).json({ error: "Employee reportsTo field not found" });
    }
    const fromManagerId = req.user.employeeId; // Get the current manager's ID from the authenticated user
    if (!employeeId || !toManagerId || !jobId||!fromManagerId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const approval = await TransferApproval.create({
      employeeId,
      fromManagerId,
      toManagerId,
      jobId,
      status: "pending",
    });
    res.status(201).json(approval);
  } catch (err) {
    console.log("Error creating approval request:", err);
    
    res.status(500).json({ error: "Failed to create approval request" });
  }
};

// Get pending approvals for a manager
exports.getPendingApprovals = async (req, res) => {
  try {
    const managerId = req.user.employeeId;
    const approvals = await TransferApproval.find({
      toManagerId: managerId,
      status: "pending",
    });
    res.status(200).json(approvals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch approvals" });
  }
};

// Approve or reject a transfer
exports.updateApprovalStatus = async (req, res) => {
  try {
    const { jobId, status } = req.body;

    // Find the approval request by jobId
    const approval = await TransferApproval.findOne({ jobId });

    if (!approval) {
      return res.status(404).json({ error: "Approval with jobId not found" });
    }

    // Check if the logged-in user is the toManager
    if (req.user.employeeId !== approval.toManagerId) {
      return res.status(403).json({ error: "Not authorized to perform this action" });
    }

    // Update the approval status
    approval.status = status;
    await approval.save();

    // If approved, update the applicant's reportsTo field
    if (status === 'approved') {
      const updatedUser = await User.findOneAndUpdate(
        { employeeId: approval.applicantId },
        { reportsTo: approval.toManagerId },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "Employee not found to update reportsTo" });
      }
    }

    res.status(200).json(approval);
  } catch (err) {
    res.status(500).json({ error: "Failed to update approval status" });
  }
};

