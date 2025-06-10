const mongoose = require('mongoose');

const TransferApprovalSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  fromManagerId: { type: String, required: true },
  toManagerId: { type: String, required: true },
  jobId: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TransferApproval', TransferApprovalSchema);
