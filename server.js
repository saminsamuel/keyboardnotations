require('dotenv').config(); // ⬅️ ADD THIS AS THE VERY FIRST LINE

const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// 1. Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 2. Serve Static Files (CSS, JS, Images, HTML)
app.use(express.static(__dirname)); 

// 3. Database Connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "music_library",
  password: process.env.PG_PASSWORD, // ⬅️ CRUCIAL CHANGE: Read securely from .env
  port: process.env.PG_PORT,         // ⬅️ Read port securely (or use 5432 directly)
});

// 4. Home Route (The Fix for "Cannot GET /")
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 5. Contact Form POST API
app.post("/contact", async (req, res) => {
  const { name, email, number } = req.body;
  const sql = "INSERT INTO contacts (name, email, phone_number) VALUES ($1, $2, $3) RETURNING *";

  try {
    const result = await pool.query(sql, [name, email, number]);
    console.log("✔ Contact added:", result.rows[0]);
    res.status(201).json({ message: "Contact saved successfully" });
  } catch (err) {
    console.error("❌ Insert error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// 6. Start Server
pool.connect((err, client, release) => {
    if (err) {
      return console.error("❌ Error connecting to database. Check credentials!", err.stack);
    }
    console.log("✅ Connected to PostgreSQL successfully using environment variables!");
    release();
});

app.listen(3000, () => {
  console.log("🚀 Server is running on http://localhost:3000");
});