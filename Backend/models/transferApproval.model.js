const mongoose = require('mongoose');


 

const TransferApprovalSchema = new mongoose.Schema({

  requestId: { type: String, required: true, unique: true },

  employeeId: { type: String, required: true },

  fromManagerId: { type: String, required: true },

  toManagerId: { type: String, required: true },

  jobId: { type: String, required: true },

  status: {

    type: String,

    enum: ['pending', 'approved','Accepted - Pending Approval','rejected'],

    default: 'pending'

  },

  createdAt: {

    type: Date,

    default: Date.now

  }

});


 

// ✅ Create a composite unique index on (employeeId, jobId)

TransferApprovalSchema.index({ employeeId: 1, jobId: 1 }, { unique: true });


 

module.exports = mongoose.model('TransferApproval', TransferApprovalSchema);


 