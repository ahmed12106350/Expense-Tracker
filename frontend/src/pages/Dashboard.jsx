import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Dashboard({ onLogout }) {
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

    const [analyzing, setAnalyzing] = useState(false)
    const [insight, setInsight] = useState('')

    const handleAnalyze = async () => {
        setAnalyzing(true)
        setInsight('')
        try {
            const response = await api.post('/ai/analyze')
            console.log('AI response:', response.data)
            setInsight(response.data.insight)
        } catch (err) {
            setInsight('Could not analyze spending right now. Try again later.')
        } finally {
            setAnalyzing(false)
        }
    }

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const balance = totalIncome - totalExpense

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">

            {/* Navbar */}
            <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">💰</span>
                    <span
                        onClick={() => navigate('/dashboard')}
                        className="text-lg font-bold text-gray-900 dark:text-white cursor-pointer hover:text-indigo-600 transition"
                    >
                        ExpenseTracker
                    </span>
                </div>
                <button

                    onClick={onLogout}

                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}
                >
                    Log out
                </button>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-8">

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Income</p>
                        <p className="text-2xl font-bold text-green-500">
                            +₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Expenses</p>
                        <p className="text-2xl font-bold text-red-500">
                            -₹{totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Net Balance</p>
                        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-indigo-600' : 'text-red-500'}`}>
                            {balance >= 0 ? '+' : ''}₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-8">
                    <button
                        onClick={() => navigate('/add')}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-md"
                    >
                        + Add Transaction
                    </button>
                    <button
                        onClick={() => navigate('/transactions')}
                        className="px-5 py-2.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 transition shadow-sm"
                    >
                        View All Transactions
                    </button>
                    <button
                        onClick={handleAnalyze}
                        disabled={analyzing}
                        className="px-5 py-2.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 transition shadow-sm disabled:opacity-60"
                    >
                        {analyzing ? 'Analyzing...' : ' Analyze My Spending'}
                    </button>
                </div>
                {/* AI Insight Card */}
                {insight && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-6 mb-8">
                        <h3 className="font-bold text-indigo-700 dark:text-indigo-300 mb-2"> AI Spending Insight</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{insight}</p>
                    </div>
                )}

                {/* Recent Transactions */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <h2 className="font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
                        <button
                            onClick={() => navigate('/transactions')}
                            className="text-sm text-indigo-600 hover:underline font-semibold"
                        >
                            View all
                        </button>
                    </div>
                    <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                        {transactions.slice(0, 5).map((t) => (
                            <li key={t.id} className="flex items-center gap-4 px-6 py-4">
                                <span className="text-2xl">{t.category_icon}</span>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                        {t.description || 'Transaction'}
                                    </p>
                                    <p className="text-xs text-gray-400">{t.category_name}</p>
                                </div>
                                <span className={`font-bold text-sm ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                    {t.type === 'income' ? '+' : '-'}₹{parseFloat(t.amount).toLocaleString('en-IN')}
                                </span>
                            </li>
                        ))}
                        {transactions.length === 0 && (
                            <li className="px-6 py-8 text-center text-gray-400 text-sm">
                                No transactions yet. Add one to get started.
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Dashboard