const multer = require('multer');
const path = require('path');
const fs = require('fs'); // 🔥 File system module add kiya

// Check karo ki 'uploads' folder hai ya nahi, nahi hai toh khud bana lo
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Image kahan aur kis naam se save karni hai, ye uska rule hai
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Ab error nahi aayega kyunki folder ban chuka hai
    },
    filename: function (req, file, cb) {
        // Har image ko unique naam dene ke liye date jod di
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

module.exports = upload;