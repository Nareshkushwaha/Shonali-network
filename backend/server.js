const express = require('express');
const cors = require('cors');
const path = require('path'); // 🔥 Path module add kiya
require('dotenv').config();

// Database connect kar rahe hain
require('./config/db'); 

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes 
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/sub-services', require('./routes/subServiceRoutes'));
app.use('/api/projects', require('./routes/projectRoutes')); 
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/brochures', require('./routes/brochureRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Backend Server is running on port ${PORT}`);
});