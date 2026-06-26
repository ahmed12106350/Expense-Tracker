import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Dashboard() {
    const [transactions, setTransactions] = useState([])
    const navigate = useNavigate()

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
            <button onClick={() => navigate('/add')}>+ Add Transaction</button>
            <button onClick={() => navigate('/transactions')}>View All Transactions</button>
            <ul>
                {transactions.map((t) => (
                    <li key={t.id}>
                        {t.category_icon} {t.description} — ₹{t.amount}
                    </li>
                ))}
            </ul>
            <h1 className="text-3xl font-bold text-indigo-600">Dashboard</h1>
        </div>
    )
}

export default Dashboard