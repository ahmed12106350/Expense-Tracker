const { GoogleGenAI } = require('@google/genai')
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
const express = require('express')
const pool = require('../db/pool')
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router()

router.use(authMiddleware)

router.post('/analyze', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT t.*, c.name as category_name 
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = $1 AND t.date >= NOW() - INTERVAL '30 days'
       ORDER BY t.date DESC`,
            [req.userId]
        )
        const transactions = result.rows
        // next: build the prompt and call Gemini — we'll add this next
        const prompt = `
Here is a user's spending data for the last 30 days:
${JSON.stringify(transactions)}

Based on this data, provide:
1. A brief analysis of their spending compared to their income
2. Identify 2-3 categories where spending seems unnecessary or could be reduced
3. One specific, actionable suggestion for what to cut down on and how much they could save

Keep the response concise and practical, under 150 words.`
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        })

        res.json({ insight: response.text })
    } catch (err) {
        console.error(err)
        if (err.status === 503) {
            return res.status(503).json({ error: 'AI service is busy right now. Please try again in a moment.' })
        }
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router