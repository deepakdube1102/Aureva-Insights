const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true,
  },
  schemeCode: {
    type: Number,
    required: [true, 'Scheme code is required'],
  },
  schemeName: {
    type: String,
    required: [true, 'Scheme name is required'],
    trim: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound unique index: one user can't add the same scheme twice
watchlistSchema.index({ userId: 1, schemeCode: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
