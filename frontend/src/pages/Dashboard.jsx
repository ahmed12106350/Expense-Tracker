import { useState, useEffect } from 'react'
import api from '../api/axios'

function Dashboard() {
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get('/transactions')
                setTransactions(response.data)
            } catch (error) {
                console.error('Error fetching transactions', error.message)
            }
        }
        fetchTransactions()
    }, [])

    return (
        <div className="page-wrapper" style={{ padding: 24 }}>
            <h1 style={{ color: 'var(--text-h)', fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Dashboard</h1>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {transactions.map((t) => (
                    <li key={t.id} style={{ padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 10, marginBottom: 8, border: '1px solid var(--border)', color: 'var(--text-h)' }}>
                        {t.category_icon} {t.description} — ₹{t.amount}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Dashboard