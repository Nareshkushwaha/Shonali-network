const Lead = require('../models/leadModel');

const getLeads = async (req, res) => {
    try {
        const leads = await Lead.getAllLeads();
        res.status(200).json(leads);
    } catch (error) { res.status(500).json({ message: 'Error fetching leads' }); }
};

const addLead = async (req, res) => {
    try {
        const newLead = await Lead.createLead(req.body);
        res.status(201).json(newLead);
    } catch (error) { res.status(500).json({ message: 'Database error' }); }
};

const updateLeadStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await Lead.updateStatus(id, status);
        res.status(200).json({ message: 'Status updated' });
    } catch (error) { res.status(500).json({ message: 'Update failed' }); }
};

const removeLead = async (req, res) => {
    try {
        const { id } = req.params;
        await Lead.deleteLead(id);
        res.status(200).json({ message: 'Lead deleted' });
    } catch (error) { res.status(500).json({ message: 'Delete failed' }); }
};

module.exports = { getLeads, addLead, updateLeadStatus, removeLead };