const express = require('express');
const router = express.Router();
const { getLeads, addLead, updateLeadStatus, removeLead } = require('../controllers/leadController');
const { protect } = require('../middlewares/authMiddleware');

// Dashboard par dekhne, update aur delete karne ke liye Guard (protect) zaruri hai
router.get('/', protect, getLeads);
router.put('/:id/status', protect, updateLeadStatus);
router.delete('/:id', protect, removeLead);

// 🔥 Naya lead frontend website (Public) se aayega, isliye isme guard nahi lagaya
router.post('/', addLead); 

module.exports = router;