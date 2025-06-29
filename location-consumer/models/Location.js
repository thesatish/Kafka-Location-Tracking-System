const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  vehicleId: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  timestamp: { type: Date, required: true },
}, { timestamps: true });

locationSchema.index({ vehicleId: 1, timestamp: 1 }, { unique: true });

module.exports = mongoose.model('Location', locationSchema);
