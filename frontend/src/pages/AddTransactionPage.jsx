import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function AddTransaction() {
    const [amount, setAmount] = useState('')
    const [type, setType] = useState('expense')
    const [categoryId, setCategoryId] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/transactions/categories')
                const dbCategories = response.data
                setCategories(dbCategories)
                if (dbCategories.length > 0) {
                    setCategoryId(dbCategories[0].id)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchCategories()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await api.post('/transactions', {
                amount: parseFloat(amount),
                type,
                category_id: categoryId,
                description,
                date
            })
            setSuccess(true)
            setAmount('')
            setDescription('')
            setTimeout(() => {
                navigate('/dashboard')
            }, 1000)
        } catch (error) {
            console.error(error)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
            {/* Navbar */}
            <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
                <div onClick={() => navigate('/dashboard')} className="flex items-center gap-2 cursor-pointer">
                    <span className="text-2xl">💰</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white hover:text-indigo-600 transition">ExpenseTracker</span>
                </div>
                <button onClick={() => navigate('/dashboard')} className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-indigo-600 transition">
                    ← Back
                </button>
            </nav>
            <div className="flex items-center justify-center p-4 pt-8">
                <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                    >
                        ←
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">New Transaction</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Record an income or expense</p>
                    </div>
                </div>

                {/* Success message */}
                {success && (
                    <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm">
                        Transaction saved! Redirecting...
                    </div>
                )}

                {isLoading ? (
                    <p className="text-center text-gray-400 py-8">Loading categories...</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Type toggle */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Transaction type
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setType('expense')}
                                    className={`py-2.5 rounded-xl font-semibold text-sm transition border ${type === 'expense'
                                        ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400'
                                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                                        }`}
                                >
                                    🔴 Expense
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType('income')}
                                    className={`py-2.5 rounded-xl font-semibold text-sm transition border ${type === 'income'
                                        ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-600 dark:text-green-400'
                                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                                        }`}
                                >
                                    🟢 Income
                                </button>
                            </div>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Amount
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Category
                            </label>
                            <select
                                required
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Description (optional)
                            </label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="e.g. Grocery shopping"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Date
                            </label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl transition shadow-md mt-2"
                        >
                            {saving ? 'Saving...' : `Save ${type === 'expense' ? 'Expense' : 'Income'}`}
                        </button>
                    </form>
                )}
            </div>
        </div>
     </div >
    )
}