const mongoose = require('mongoose');

const wasteSchema = new mongoose.Schema({
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Waste', wasteSchema);
