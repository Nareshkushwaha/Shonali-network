const express = require('express');
const router = express.Router();
const { getProjects, addProject, removeProject } = require('../controllers/projectController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware'); // 🔥 Image Guard

router.get('/', getProjects);

// 🔥 Pehle 'protect' check karega (Admin hai ya nahi), phir 'upload.single' image pakdega
router.post('/', protect, upload.single('image'), addProject); 

router.delete('/:id', protect, removeProject);

module.exports = router;