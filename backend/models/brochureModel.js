const db = require('../config/db');

const saveDownloadRecord = async (data) => {
    const id = `D-${Date.now()}`;
    const { name, email, company, documentName } = data;
    
    const query = `INSERT INTO brochure_downloads (id, name, email, company, documentName) VALUES (?, ?, ?, ?, ?)`;
    await db.execute(query, [id, name, email, company || 'Independent', documentName]);
    
    return true;
};

const getDownloadsList = async () => {
    const [rows] = await db.execute('SELECT * FROM brochure_downloads ORDER BY download_date DESC');
    return rows;
};

module.exports = { saveDownloadRecord, getDownloadsList };