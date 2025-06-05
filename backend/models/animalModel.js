const mongoose = require('mongoose');

const AnimalImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true
  },
  isPrimary: {
    type: Boolean,
    default: false
  }
}, {
  _id: false
});

const AnimalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  species: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Species',
    required: true
  },
  breed: {
    type: String,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 0
  },
  color: {
    type: String,
    trim: true
  },
  weight: {
    type: Number,
    min: 0
  },
  gender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gender'
  },
  size: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Size'
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Status',
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  images: {
    type: [AnimalImageSchema],
    default: []
  },
  firstImageUrl: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

AnimalSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    const primaryImage = this.images.find(img => img.isPrimary) || this.images[0];
    this.firstImageUrl = primaryImage.url;
  }
  next();
});

module.exports = mongoose.model('Animal', AnimalSchema);