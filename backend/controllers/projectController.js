const Project = require('../models/projectModel');

const getProjects = async (req, res) => {
    try {
        const projects = await Project.getAllProjects();
        res.status(200).json(projects);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ message: 'Error fetching projects' });
    }
};

const addProject = async (req, res) => {
    try {
        const { title, category, description, liveUrl } = req.body; // 🔥 liveUrl pakda
        
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
        
        if (!title || !category || !imagePath || !description) {
            return res.status(400).json({ message: 'Saare fields aur image bharna zaroori hai!' });
        }
        
        const projectData = { title, category, image: imagePath, description, liveUrl };
        const newProject = await Project.createProject(projectData);
        
        res.status(201).json(newProject);
    } catch (error) {
        console.error("Database Save Error:", error); 
        res.status(500).json({ message: 'Database error', error: error.message });
    }
};

const removeProject = async (req, res) => {
    try {
        const { id } = req.params;
        await Project.deleteProject(id);
        res.status(200).json({ message: 'Project deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed' });
    }
};

module.exports = { getProjects, addProject, removeProject };