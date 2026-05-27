const SubService = require('../models/subServiceModel');

const getServices = async (req, res) => {
    try {
        const services = await SubService.getAllSubServices();
        res.status(200).json(services);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ message: 'Error fetching services' });
    }
};

const addService = async (req, res) => {
    try {
        const { parentService, title, description } = req.body;
        
        if (!parentService || !title || !description) {
            return res.status(400).json({ message: 'Required fields missing!' });
        }
        
        const newService = await SubService.createSubService(req.body);
        
        // 🔥 FIX: React seedha object maang raha hai, toh seedha data bhejenge
        res.status(201).json(newService);
        
    } catch (error) {
        // 🔥 Ye line terminal mein EXACT error batayegi ki MySQL kyu ro raha hai
        console.error("🔥 Database Save Error:", error); 
        res.status(500).json({ message: 'Database error', error: error.message });
    }
};

// 🔥 NAYA CODE: Sub-service ko delete karne wala controller
const deleteService = async (req, res) => {
    try {
        const { id } = req.params; // URL se ID nikal li
        const result = await SubService.deleteSubService(id);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Sub-Service pehle hi delete ho chuki hai ya mili nahi!' });
        }
        
        res.status(200).json({ message: 'Sub-Service successfully ud gayi!' });
    } catch (error) {
        console.error("🔥 Delete Error:", error);
        res.status(500).json({ message: 'Delete karne mein error aayi', error: error.message });
    }
};

// Yahan deleteService ko export karna mat bhulna
module.exports = { getServices, addService, deleteService };