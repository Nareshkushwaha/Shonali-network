const db = require('../config/db');

const getAllProjects = async () => {
    const [rows] = await db.execute('SELECT * FROM projects');
    return rows;
};

const createProject = async (data) => {
    const id = `P-${Date.now()}`; 
    const { title, category, image, description, liveUrl } = data; // 🔥 liveUrl add kiya

    const query = `INSERT INTO projects (id, title, category, image, description, liveUrl) VALUES (?, ?, ?, ?, ?, ?)`;
        
    await db.execute(query, [id, title, category, image, description, liveUrl || '']);
    
    return { id, title, category, image, description, liveUrl };
};

const deleteProject = async (id) => {
    await db.execute('DELETE FROM projects WHERE id = ?', [id]);
    return true;
};

module.exports = { getAllProjects, createProject, deleteProject };