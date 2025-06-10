const express = require("express");
const router = express.Router();
const approvalController = require("../controllers/approval.controller");


// GET: pending approvals for current manager
router.get("/get-transfer", approvalController.getPendingApprovals);

router.post("/request-transfer",approvalController.createTransferApproval);

// POST: approve or reject a transfer
router.post("/transfer-response", approvalController.updateApprovalStatus);

module.exports = router;
