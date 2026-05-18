const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// 🔥 Ye detector batayega ki DB connect hua ya nahi, aur kahan hua
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database Connection Failed:', err.message);
    } else {
        console.log(`✅ MySQL Connected Successfully to: ${process.env.DB_HOST}`);
        connection.release();
    }
});

module.exports = pool.promise();