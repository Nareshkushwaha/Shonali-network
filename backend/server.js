require("dotenv").config();   // 👈 सबसे ऊपर

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");

const app = express();
app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET;
// ==========================================
// 🗄️ MYSQL DATABASE CONNECTION 
// ==========================================
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.getConnection((err, connection) => {
  if (err) console.error("Database connection error: ", err);
  else {
    console.log("MySQL Database se 100% connect ho gaya! 🚀");
    connection.release();
    
    db.query("SELECT * FROM admins", (err, results) => {
      if (results && results.length === 0) {
        const hashedPw = bcrypt.hashSync("Naresh@2026", 8); 
        db.query(
          "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)",
          ["Naresh Kushwah", "admin@shonalinetwork.com", hashedPw]
        );
        console.log("✅ Default Admin database me create ho gaya!");
      }
    });
  }
});

function verifyToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "No token provided" });

  try {
    const actualToken = token.split(" ")[1] || token; 
    const decoded = jwt.verify(actualToken, SECRET);
    req.user = decoded; 
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

app.get("/", (req, res) => {
  res.send("Shonali Network Backend running with MySQL! 🚀");
});

// ==========================================
// 🔐 1. ADMIN LOGIN, PROFILE & PASSWORD API
// ==========================================
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Required fields missing" });

  db.query("SELECT * FROM admins WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(401).json({ error: "Invalid email" });

    const admin = results[0];
    const isMatch = bcrypt.compareSync(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: "Wrong password" });

    const token = jwt.sign({ email: admin.email }, SECRET, { expiresIn: "12h" });
    delete admin.password; 
    res.json({ success: true, token, user: admin });
  });
});

app.get("/api/admin/profile", verifyToken, (req, res) => {
  db.query("SELECT name, email, avatarUrl FROM admins WHERE email = ?", [req.user.email], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: "Profile not found" });
    res.json(results[0]);
  });
});

app.put("/api/admin/profile", verifyToken, (req, res) => {
  const { name, email, avatarUrl } = req.body;
  db.query(
    "UPDATE admins SET name = ?, email = ?, avatarUrl = ? WHERE email = ?", 
    [name, email, avatarUrl || "", req.user.email], 
    (err) => {
      if (err) return res.status(500).json({ error: "Update failed" });
      res.json({ success: true, data: { name, email, avatarUrl, role: "Super Admin" } });
  });
});

// 🔥 NAYA: Password Change API
app.put("/api/admin/change-password", verifyToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  db.query("SELECT * FROM admins WHERE email = ?", [req.user.email], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: "Admin not found" });

    const admin = results[0];
    const isMatch = bcrypt.compareSync(currentPassword, admin.password);
    if (!isMatch) return res.status(401).json({ error: "Incorrect current password" });

    const hashedPw = bcrypt.hashSync(newPassword, 8);
    db.query("UPDATE admins SET password = ? WHERE email = ?", [hashedPw, req.user.email], (updateErr) => {
      if (updateErr) return res.status(500).json({ error: "Failed to update password" });
      res.json({ success: true, message: "Password updated successfully" });
    });
  });
});

// ==========================================
// 📞 2. LEADS API
// ==========================================
app.get("/api/leads", (req, res) => {
  db.query("SELECT * FROM leads ORDER BY date DESC", (err, results) => {
    if (err) return res.status(500).json({ error: "DB Error fetching leads" });
    res.json(results || []);
  });
});

app.post("/api/leads", (req, res) => {
  const { name, email, serviceInterest, budget, message } = req.body;
  const leadId = `L-${Math.floor(Math.random() * 9000) + 1000}`;
  const date = new Date().toLocaleDateString();

  const sql = "INSERT INTO leads (id, name, email, serviceInterest, budget, status, message, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [leadId, name, email, serviceInterest || "General", budget || "Not Specified", "New", message, date];

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ error: "Save failed" });
    res.json({ success: true, data: { id: leadId, name, email, serviceInterest, budget, status: "New", message, date } });
  });
});

app.put("/api/leads/:id", verifyToken, (req, res) => {
  db.query("UPDATE leads SET status = ? WHERE id = ?", [req.body.status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Update failed" });
    res.json({ success: true });
  });
});

app.delete("/api/leads/:id", verifyToken, (req, res) => {
  db.query("DELETE FROM leads WHERE id = ?", [req.params.id], (err) => res.json({ success: true }));
});

// ==========================================
// 🏗️ 3. PROJECTS API
// ==========================================
app.get("/api/projects", (req, res) => {
  db.query("SELECT * FROM projects", (err, results) => res.json(results || []));
});

app.post("/api/projects", verifyToken, (req, res) => {
  const { title, category, image, description } = req.body;
  const id = `P-${Date.now()}`;
  db.query("INSERT INTO projects (id, title, category, image, description) VALUES (?, ?, ?, ?, ?)", 
  [id, title, category, image, description], (err) => {
    if (err) return res.status(500).json({ error: "Failed" });
    res.json({ success: true, data: { id, title, category, image, description } });
  });
});

app.delete("/api/projects/:id", verifyToken, (req, res) => {
  db.query("DELETE FROM projects WHERE id = ?", [req.params.id], (err) => res.json({ success: true }));
});

// ==========================================
// 🛠️ 4. SUB-SERVICES API
// ==========================================
app.get("/api/sub-services", (req, res) => {
  db.query("SELECT * FROM sub_services", (err, results) => {
    if (err) return res.status(500).json({ error: "Error" });
    const formattedServices = results.map(srv => ({
      ...srv,
      featuresList: srv.featuresList ? srv.featuresList.split(',') : []
    }));
    res.json(formattedServices);
  });
});

app.post("/api/sub-services", verifyToken, (req, res) => {
  const { parentService, title, price, description, featuresList, cta } = req.body;
  const id = `S-${Date.now()}`;
  const featuresString = (featuresList && Array.isArray(featuresList)) ? featuresList.join(',') : "";
  db.query("INSERT INTO sub_services (id, parentService, title, price, description, featuresList, cta, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'active')",
  [id, parentService, title, price, description, featuresString, cta], (err) => {
    if (err) return res.status(500).json({ error: "Failed" });
    res.json({ success: true, data: { id, parentService, title, price, description, featuresList: featuresList || [], cta, status: "active" } });
  });
});

app.delete("/api/sub-services/:id", verifyToken, (req, res) => {
  db.query("DELETE FROM sub_services WHERE id = ?", [req.params.id], (err) => res.json({ success: true }));
});

// ==========================================
// 📄 5. BROCHURE REQUESTS API
// ==========================================
app.post("/api/brochures", (req, res) => {
  const { name, email, company, documentName } = req.body;
  const id = `RX-${Math.floor(Math.random() * 9000) + 1000}`;
  const date = new Date().toISOString().split('T')[0];
  db.query("INSERT INTO brochure (id, name, email, company, documentName, status, date) VALUES (?, ?, ?, ?, ?, 'Pending', ?)",
    [id, name, email, company || "Independent", documentName, date],
    (err) => res.json({ success: true, data: { id, name, email, company, documentName, status: "Pending", date } })
  );
});

app.get("/api/brochures", (req, res) =>  {
  db.query("SELECT * FROM brochure ORDER BY date DESC", (err, results) => res.json(results || []));
});

app.put("/api/brochures/:id", verifyToken, (req, res) => {
  db.query("UPDATE brochure SET status = ? WHERE id = ?", [req.body.status, req.params.id], (err) => res.json({ success: true }));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT} 🚀`);
});