import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function TransactionsPage() {
    const navigate = useNavigate()
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState(null)

    const fetchTransactions = async () => {
        setLoading(true)
        try {
            const res = await api.get('/transactions')
            setTransactions(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [])

    const handleDelete = async (id) => {
        setDeletingId(id)
        try {
            await api.delete(`/transactions/${id}`)
            setTransactions(transactions.filter(t => t.id !== id))
        } catch (err) {
            console.error(err)
        } finally {
            setDeletingId(null)
        }
    }

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    return (
        
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">

            {/* Header */}
            <div className="max-w-3xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition text-lg"
                        >
                            ←
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Transactions</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} recorded
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/add')}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-md text-sm"
                    >
                        + Add New
                    </button>
                </div>

                {/* Summary chips */}
                {!loading && transactions.length > 0 && (
                    <div className="flex gap-3 mb-6 flex-wrap">
                        <div className="px-4 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm font-semibold">
                            Income +₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-semibold">
                            Expenses -₹{totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold">
                            Net {(totalIncome - totalExpense) >= 0 ? '+' : ''}₹{(totalIncome - totalExpense).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <div className="w-10 h-10 border-2 border-gray-200 dark:border-gray-700 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                        <p className="text-sm">Loading transactions...</p>
                    </div>
                )}

                {/* Empty */}
                {!loading && transactions.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <span className="text-4xl mb-3">💸</span>
                        <p className="text-gray-400 text-sm mb-4">No transactions yet. Add one to get started.</p>
                        <button
                            onClick={() => navigate('/add')}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition"
                        >
                            + Add Transaction
                        </button>
                    </div>
                )}

                {/* Transaction list */}
                {!loading && transactions.length > 0 && (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                            {transactions.map((t) => (
                                <li
                                    key={t.id}
                                    className={`flex items-center gap-4 px-6 py-4 transition hover:bg-gray-50 dark:hover:bg-gray-800 ${deletingId === t.id ? 'opacity-40 pointer-events-none' : ''}`}
                                >
                                    {/* Icon */}
                                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl flex-shrink-0">
                                        {t.category_icon || '💰'}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                            {t.description || 'Transaction'}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {t.category_name} · {formatDate(t.date)}
                                        </p>
                                    </div>

                                    {/* Amount */}
                                    <span className={`font-bold text-sm ${t.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                        {t.type === 'income' ? '+' : '-'}₹{parseFloat(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </span>

                                    {/* Delete */}
                                    <button
                                        onClick={() => handleDelete(t.id)}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex-shrink-0"
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                            <path d="M10 11v6M14 11v6" />
                                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                        </svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TransactionsPage