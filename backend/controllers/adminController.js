const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken'); 
require('dotenv').config();

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email aur password dono daalna zaruri hai!' });

        const admin = await Admin.getAdminByEmail(email);
        if (!admin) return res.status(404).json({ message: 'Yeh email database mein nahi mila!' });
        if (admin.password !== password) return res.status(401).json({ message: 'Password galat hai bhai!' });

        const token = jwt.sign(
            { id: admin.id, email: admin.email }, 
            process.env.JWT_SECRET || 'shonalisecret', 
            { expiresIn: '1d' } 
        );

        res.status(200).json({ 
            message: 'Login successful!', 
            token: token, 
            admin: { id: admin.id, name: admin.name, email: admin.email, avatar: admin.avatar } 
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// NAYA: Profile Update Controller
const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        const adminId = req.admin.id; // Guard (protect) se ID mil jayegi
        const avatarPath = req.file ? `/uploads/${req.file.filename}` : null;

        await Admin.updateAdminProfile(adminId, name, avatarPath);
        res.status(200).json({ message: 'Profile Updated!', avatar: avatarPath });
    } catch (error) {
        res.status(500).json({ message: 'Update failed', error });
    }
};

// NAYA: Password Change Controller
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const adminId = req.admin.id;

        const admin = await Admin.getAdminById(adminId);
        
        if (admin.password !== oldPassword) {
            return res.status(400).json({ message: 'Purana password galat hai!' });
        }

        await Admin.updateAdminPassword(adminId, newPassword);
        res.status(200).json({ message: 'Password changed successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Password update failed', error });
    }
};

module.exports = { loginAdmin, updateProfile, changePassword };