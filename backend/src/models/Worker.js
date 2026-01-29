const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  workerId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: String,
  address: {
    type: String,
    required: true
  },
  workType: {
    type: String,
    enum: ['Cutting', 'Sewing', 'Embroidery', 'Finishing', 'Other'],
    required: true
  },
  ratePerWork: {
    type: Number,
    required: true,
    min: 0
  },
  rateType: {
    type: String,
    enum: ['per_piece', 'per_hour', 'per_day', 'monthly'],
    default: 'per_piece'
  },
  notes: String,
  joinDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    branchName: String
  },
  totalWork: {
    type: Number,
    default: 0
  },
  totalSalary: {
    type: Number,
    default: 0
  },
  advancePaid: {
    type: Number,
    default: 0
  },
  dueAmount: {
    type: Number,
    default: 0
  },
  lastPaymentDate: Date,
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

workerSchema.index({ workerId: 1 });
workerSchema.index({ name: 1 });
workerSchema.index({ workType: 1 });
workerSchema.index({ isActive: 1 });

module.exports = mongoose.model('Worker', workerSchema);
