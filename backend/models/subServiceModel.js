const db = require('../config/db');

const getAllSubServices = async () => {
    const [rows] = await db.execute('SELECT * FROM sub_services');
    return rows;
};

const createSubService = async (data) => {
    const id = `S-${Date.now()}`; 
    const { parentService, title, price, description, featuresList, cta } = data;

    // React array bhej raha hai, hum MySQL ke liye usko comma(,) wala string bana rahe hain
    const featuresString = Array.isArray(featuresList) ? featuresList.join(', ') : (featuresList || '');

    const query = `INSERT INTO sub_services 
        (id, parentService, title, price, description, featuresList, cta, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
    await db.execute(query, [
        id, 
        parentService || '', 
        title || '', 
        price || '', 
        description || '', 
        featuresString, 
        cta || 'Inquire for Project', 
        'active' // default status
    ]);
    
    return {
        id, parentService, title, price, description, featuresList: featuresString, cta, status: 'active'
    };
};

module.exports = { getAllSubServices, createSubService };