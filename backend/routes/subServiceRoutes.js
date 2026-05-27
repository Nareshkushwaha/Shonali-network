const express = require('express');
const router = express.Router();
// 🔥 deleteService ko bhi yahan import kiya
const { getServices, addService, deleteService } = require('../controllers/subServiceController');
const { protect } = require('../middlewares/authMiddleware');

// Get (Data dekhne) ke liye Guard nahi chahiye
router.get('/', getServices);

// Add karne ke liye
router.post('/', protect, addService); 

// 🔥 NAYA CODE: Delete karne ka rasta (URL mein ID aayegi)
router.delete('/:id', protect, deleteService);

module.exports = router;