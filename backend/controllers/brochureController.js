const BrochureModel = require('../models/brochureModel');
const fs = require('fs');
const path = require('path');

// Public API - Jab koi user download karega
const recordDownload = async (req, res) => {
    try {
        await BrochureModel.saveDownloadRecord(req.body);
        res.status(200).json({ message: "Download tracked" });
    } catch (error) {
        res.status(500).json({ error: "Tracking failed" });
    }
};

// Admin API - List dekhne ke liye
const getDownloads = async (req, res) => {
    try {
        const list = await BrochureModel.getDownloadsList();
        res.status(200).json(list);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch list" });
    }
};

// Admin API - Naya PDF Upload karna
const uploadPdf = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });
        
        // Return the exact URL path
        const fileUrl = `/uploads/${req.file.filename}`;
        res.status(200).json({ message: "File Uploaded", fileUrl: fileUrl, fileName: req.file.originalname });
    } catch (error) {
        res.status(500).json({ error: "Upload Failed" });
    }
};

// Public API - Check karna ki PDF hai ya nahi
const checkStatus = async (req, res) => {
     // Abhi hum simplify karne ke liye status ko local storage/database ke variables par chor sakte hain.
     res.status(200).json({ success: true });
}

module.exports = { recordDownload, getDownloads, uploadPdf, checkStatus };