const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
            [email, passwordHash]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') { // Postgres unique violation
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Verify token — used by frontend on app load to check if stored token is still valid
router.get('/me', authMiddleware, (req, res) => {
    res.json({ userId: req.userId });
});

module.exports = router;