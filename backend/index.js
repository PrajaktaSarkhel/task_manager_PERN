const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Logger Middleware (Professional touch)
app.use((req, res, next) => {
    console.log(`${new Date().toLocaleString()} | ${req.method} ${req.url}`);
    next();
});

// --- Database Connection ---
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Test DB Connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) console.error("❌ Database connection error:", err.stack);
    else console.log("✅ Database connected successfully");
});

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("❌ FATAL ERROR: JWT_SECRET is not defined in .env file.");
    process.exit(1); // Stop the server if the secret is missing
}

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    try {
        const verified = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ error: "Invalid or expired token." });
    }
};

// --- Auth Routes ---

// Register
app.post('/auth/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: "User already exists or invalid data." });
    }
});

// Login
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });

        const validPass = await bcrypt.compare(password, result.rows[0].password);
        if (!validPass) return res.status(401).json({ error: "Invalid password" });

        const token = jwt.sign({ id: result.rows[0].id }, JWT_SECRET, { expiresIn: '2h' });
        res.json({ token, user: { email: result.rows[0].email } });
    } catch (err) {
        res.status(500).json({ error: "Login error" });
    }
});

// --- Task Routes (Protected) ---

// Get all tasks for the logged-in user
app.get('/tasks', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC', 
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a task linked to user
app.post('/tasks', authenticateToken, async (req, res) => {
    const { title, description } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
            [title, description, req.user.id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update task status
app.put('/tasks/:id', authenticateToken, async (req, res) => {
    const { status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE tasks SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [status, req.params.id, req.user.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete task
app.delete('/tasks/:id', authenticateToken, async (req, res) => {
    try {
        await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));