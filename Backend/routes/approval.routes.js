const express = require("express");
const router = express.Router();
const approvalController = require("../controllers/approval.controller");

router.post("/", async (req, res) => {
  const TransferApproval = require("../models/transferApproval.model");
  try {
    const approval = await TransferApproval.create(req.body);
    res.status(201).json(approval);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: pending approvals for current manager
router.get("/get-transfer", approvalController.getPendingApprovals);

router.post("/request-transfer",approvalController.createTransferApproval);

// POST: approve or reject a transfer
router.post("/transfer-response", approvalController.updateApprovalStatus);

module.exports = router;
