// backend/models/box-model.js
const mongoose = require('mongoose');

const boxSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  timeSlot: { type: String, required: true },
  medicines: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      required: true
    },
    name: String,
    dosage: String,
    time: String
  }],
  history: [{
    medicineId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: String,
    dosage: String,
    time: String,
    takenAt: {
      type: Date,
      default: Date.now
    },
    action: {
      type: String,
      enum: ['taken', 'untaken'],
      required: true
    }
  }]
});

module.exports = mongoose.model('Box', boxSchema);