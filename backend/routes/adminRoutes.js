const express = require('express');
const router = express.Router();
const { loginAdmin, updateProfile, changePassword } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware'); 
const upload = require('../middlewares/uploadMiddleware'); // Image upload guard

router.post('/login', loginAdmin);

router.get('/dashboard', protect, (req, res) => {
    res.status(200).json({ message: 'Welcome!', adminId: req.admin.id });
});

// 🔥 NAYE RASTE: Profile aur Password Update
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.put('/password', protect, changePassword);

module.exports = router;