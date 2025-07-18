const express = require('express');
const router = express.Router();
const { castVote, getVotes } = require('../controllers/voteController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/vote', authMiddleware, castVote);
router.get('/votes/:mediaId', getVotes);

module.exports = router;
