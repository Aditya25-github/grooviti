const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mediaId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    required: true,
  },
}, { timestamps: true });

voteSchema.index({ user: 1, mediaId: 1 }, { unique: true }); // prevent duplicate votes

module.exports = mongoose.model('Vote', voteSchema);
