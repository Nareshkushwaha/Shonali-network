const db = require('../config/db');

const getAllLeads = async () => {
    // Ab naye leads sabse upar aayenge
    const [rows] = await db.execute('SELECT * FROM leads ORDER BY date DESC');
    return rows;
};

const createLead = async (data) => {
    const id = `L-${Date.now()}`; 
    // Frontend se date bhi aa rahi hai, usko pakdo
    const { name, email, serviceInterest, budget, message, date } = data;
    
    // SQL query mein 'date' add kar diya
    const query = `INSERT INTO leads (id, name, email, serviceInterest, budget, message, status, date) VALUES (?, ?, ?, ?, ?, ?, 'New', ?)`;
    
    // Query mein date variable pass kar diya
    await db.execute(query, [
        id, 
        name, 
        email, 
        serviceInterest, 
        budget, 
        message, 
        date || new Date().toISOString() // Agar frontend date dena bhool jaye, toh aaj ki date le lo
    ]);
    
    return { id, name, email, serviceInterest, budget, message, status: 'New', date };
};

const updateStatus = async (id, status) => {
    await db.execute('UPDATE leads SET status = ? WHERE id = ?', [status, id]);
    return true;
};

const deleteLead = async (id) => {
    await db.execute('DELETE FROM leads WHERE id = ?', [id]);
    return true;
};

module.exports = { getAllLeads, createLead, updateStatus, deleteLead };