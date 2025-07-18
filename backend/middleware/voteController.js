const Vote = require('../models/Vote');

exports.castVote = async (req, res) => {
  const { mediaId, mediaType } = req.body;
  const userId = req.user._id;

  try {
    const existing = await Vote.findOne({ user: userId, mediaId });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Already voted' });
    }

    const vote = await Vote.create({ user: userId, mediaId, mediaType });
    res.status(201).json({ success: true, message: 'Vote recorded', vote });

  } catch (err) {
    console.error('Vote error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getVotes = async (req, res) => {
  const { mediaId } = req.params;

  try {
    const count = await Vote.countDocuments({ mediaId });
    res.status(200).json({ success: true, mediaId, votes: count });
  } catch (err) {
    console.error('Get vote error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
