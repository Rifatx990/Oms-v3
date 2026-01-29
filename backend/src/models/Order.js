const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  orderDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  measurements: {
    type: String,
    required: true
  },
  notes: String,
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  advancePaid: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  dueAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Cutting', 'Sewing', 'Ready', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  images: [{
    url: String,
    caption: String
  }],
  assignedWorker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  timeline: [{
    status: String,
    date: Date,
    notes: String
  }],
  paymentHistory: [{
    amount: Number,
    date: Date,
    method: String,
    transactionId: String,
    collectedBy: String
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ orderId: 1 });
orderSchema.index({ customerName: 1 });
orderSchema.index({ phone: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ deliveryDate: 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate due amount
orderSchema.pre('save', function(next) {
  this.dueAmount = this.totalAmount - this.advancePaid;
  next();
});

module.exports = mongoose.model('Order', orderSchema);
