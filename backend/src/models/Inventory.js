// backend/src/models/Inventory.js
const inventorySchema = new mongoose.Schema({
  itemCode: {
    type: String,
    required: true,
    unique: true
  },
  itemName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Fabric', 'Thread', 'Button', 'Zipper', 'Accessory', 'Other']
  },
  unit: {
    type: String,
    enum: ['Meter', 'Piece', 'Kg', 'Roll', 'Set']
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  reorderLevel: {
    type: Number,
    default: 10
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  supplier: {
    name: String,
    contact: String,
    address: String
  },
  lastRestocked: Date,
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Virtual for total value
inventorySchema.virtual('totalValue').get(function() {
  return this.quantity * this.unitPrice;
});
