const express = require('express');
const pool = require('../db/pool');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// All routes in this file are protected
router.use(authMiddleware);

// GET all transactions for logged-in user
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT t.*, c.name as category_name, c.icon as category_icon
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = $1
       ORDER BY t.date DESC`,
            [req.userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST add a new transaction
router.post('/', async (req, res) => {
    const { amount, category_id, type, description, currency, date } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO transactions 
        (user_id, amount, category_id, type, description, currency, date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
            [req.userId, amount, category_id, type, description, currency || 'INR', date || new Date()]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE a transaction (only if it belongs to the logged-in user)
router.delete('/:id', async (req, res) => {
    try {
        const result = await pool.query(
            `DELETE FROM transactions 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
            [req.params.id, req.userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json({ message: 'Deleted', transaction: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET categories (for the frontend dropdown)
router.get('/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY name');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;