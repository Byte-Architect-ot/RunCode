// models/Contest.js
import mongoose from 'mongoose';

const contestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  hostUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'private'
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'running', 'ended'],
    default: 'scheduled'
  },
  startsAt: {
    type: Date,
    required: true
  },
  endsAt: {
    type: Date,
    required: true
  },
  durationMinutes: {
    type: Number,
    required: true
  },
  maxParticipants: {
    type: Number,
    default: null
  },
  allowLateJoin: {
    type: Boolean,
    default: true
  },
  contestMode: {
    type: String,
    enum: ['practice', 'icpc'],
    default: 'practice'
  },
  problemCount: {
    type: Number,
    required: true,
    min: 1,
    max: 15
  },
  ratingMin: {
    type: Number,
    default: 800
  },
  ratingMax: {
    type: Number,
    default: 1600
  },
  problems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  }],
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    score: {
      type: Number,
      default: 0
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
contestSchema.index({ status: 1, startsAt: 1 });
contestSchema.index({ hostUser: 1 });
contestSchema.index({ visibility: 1 });

export default mongoose.model('Contest', contestSchema);