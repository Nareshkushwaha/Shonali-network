const express = require('express');
const router = express.Router();
const { recordDownload, getDownloads, uploadPdf } = require('../controllers/brochureController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // Vahi purana image wala guard kaam aa jayega (usko pdf bhi allow karne ko bolenge aage)

// Public API (Website ke liye)
router.post('/download', recordDownload);

// Admin APIs (Guard ke sath)
router.get('/list', protect, getDownloads);
router.post('/upload', protect, upload.single('pdfFile'), uploadPdf); 

module.exports = router;