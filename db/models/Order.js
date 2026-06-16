const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  title: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true
  },
  deliveryAddress: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  items: {
    type: [orderItemSchema],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

orderSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret.orderId;
    delete ret._id;
    delete ret.__v;
    delete ret.orderId;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  }
});

module.exports = mongoose.model('Order', orderSchema);
