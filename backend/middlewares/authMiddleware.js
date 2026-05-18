const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // 🕵️‍♂️ DETECTIVE MODE: Dekhte hain Frontend bhej kya raha hai!
            console.log("👉 Frontend ne ye Token bheja:", token);

            // Agar kachra aa raha hai toh pehle hi rok do
            if (token === 'null' || token === 'undefined' || token === '') {
                console.log("❌ ERROR: Token 'null' ya 'undefined' hai! Matlab AdminLogin.tsx token theek se save nahi kar raha.");
                return res.status(401).json({ message: 'Frontend se token "undefined" aa raha hai!' });
            }

            const secretKey = process.env.JWT_SECRET || 'shonalisecret';
            const decoded = jwt.verify(token, secretKey);
            req.admin = decoded;
            return next(); 

        } catch (error) {
            console.error("❌ Guard Error:", error.message);
            return res.status(401).json({ message: 'Token malformed ya expire ho gaya hai.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Bina token ke aaye ho!' });
    }
};

module.exports = { protect };