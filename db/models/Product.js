const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Virtual to expose 'id' as 'productId' in JSON responses
productSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret.productId;
    delete ret._id;
    delete ret.__v;
    delete ret.productId;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  }
});

module.exports = mongoose.model('Product', productSchema);
