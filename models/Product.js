import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPercentage: {
    type: Number,
    default: 0,
  },
  benefits: [{
    type: String
  }],
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  images: [
    {
      type: String, // URLs of images
    }
  ],
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }
  ],
  ratings: {
    average: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    }
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Product = mongoose.model('Product', productSchema);

export default Product;
