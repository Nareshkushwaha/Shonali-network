const express = require('express');
const router = express.Router();
const { getServices, addService } = require('../controllers/subServiceController');
const { protect } = require('../middlewares/authMiddleware');

// Get (Data dekhne) ke liye Guard nahi chahiye
router.get('/', getServices);

router.post('/', protect, addService); 

module.exports = router;