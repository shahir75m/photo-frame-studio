import mongoose from 'mongoose';

const frameSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  aspectRatio: {
    type: String,
    required: true,
    enum: ['1:1', '9:16']
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export const Frame = mongoose.model('Frame', frameSchema);
