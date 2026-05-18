const db = require('../config/db');

const getAdminByEmail = async (email) => {
    const query = 'SELECT * FROM admins WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0];
};

// NAYA: ID se admin dhoondhne ke liye
const getAdminById = async (id) => {
    const query = 'SELECT * FROM admins WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
};

// NAYA: Profile (Name + Photo) update karne ke liye
const updateAdminProfile = async (id, name, avatar) => {
    if (avatar) {
        await db.execute('UPDATE admins SET name = ?, avatar = ? WHERE id = ?', [name, avatar, id]);
    } else {
        await db.execute('UPDATE admins SET name = ? WHERE id = ?', [name, id]);
    }
    return true;
};

// NAYA: Password update karne ke liye
const updateAdminPassword = async (id, newPassword) => {
    await db.execute('UPDATE admins SET password = ? WHERE id = ?', [newPassword, id]);
    return true;
};

module.exports = { getAdminByEmail, getAdminById, updateAdminProfile, updateAdminPassword };