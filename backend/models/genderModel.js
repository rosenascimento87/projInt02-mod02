const mongoose = require('mongoose');

const GenderSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  descricao: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    trim: true,
    default: null
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Gender', GenderSchema);
