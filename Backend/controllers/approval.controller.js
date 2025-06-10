const TransferApproval = require("../models/transferApproval.model");

// Get pending approvals for a manager
exports.getPendingApprovals = async (req, res) => {
  try {
    const managerId = req.params.managerId;
    const approvals = await TransferApproval.find({
      fromManagerId: managerId,
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
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'
    const approval = await TransferApproval.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!approval) return res.status(404).json({ error: "Approval not found" });
    res.status(200).json(approval);
  } catch (err) {
    res.status(500).json({ error: "Failed to update approval status" });
  }
};
