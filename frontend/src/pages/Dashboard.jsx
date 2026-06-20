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
        <div>
            <h1>Dashboard</h1>
            <ul>
                {transactions.map((t) => (
                    <li key={t.id}>
                        {t.category_icon} {t.description} — ₹{t.amount}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Dashboard