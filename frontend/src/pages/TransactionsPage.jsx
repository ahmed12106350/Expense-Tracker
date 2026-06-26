import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

/* ── helpers ── */
function formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

function formatAmount(amount, type) {
    const num = parseFloat(amount)
    const sign = type === 'income' ? '+' : '-'
    return `${sign}₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/* ── icons ── */
const IconBack = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
    </svg>
)

const IconTrash = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
)

/* ── component ── */
function TransactionsPage() {
    const navigate = useNavigate()

    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [deletingId, setDeletingId] = useState(null)

    /* ── fetch ── */
    const fetchTransactions = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await api.get('/transactions')
            setTransactions(res.data)
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load transactions.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [])

    /* ── delete ── */
    const handleDelete = async (id) => {
        setDeletingId(id)
        try {
            await api.delete(`/transactions/${id}`)
            // Refresh list after successful delete
            await fetchTransactions()
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to delete transaction.')
        } finally {
            setDeletingId(null)
        }
    }

    /* ── summary counts ── */
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)

    /* ── render ── */
    return (
        <div className="tx-page">

            {/* ── Header ── */}
            <div className="tx-header">
                <div className="tx-header-left">
                    {/* Back button */}
                    <button
                        id="btn-back-dashboard"
                        className="btn-back"
                        onClick={() => navigate('/dashboard')}
                    >
                        <IconBack />
                        Back to Dashboard
                    </button>

                    {/* Title */}
                    <div className="tx-title-group">
                        <h1 className="tx-title">All Transactions</h1>
                        <p className="tx-subtitle">
                            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} recorded
                        </p>
                    </div>
                </div>

                {/* Add new */}
                <button
                    id="btn-add-transaction"
                    className="btn-add"
                    onClick={() => navigate('/add')}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add New
                </button>
            </div>

            {/* ── Summary chips ── */}
            {!loading && transactions.length > 0 && (
                <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                    <div style={{
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(16,185,129,0.08)',
                        border: '1px solid rgba(16,185,129,0.25)',
                        color: 'var(--success)',
                        fontSize: 13,
                        fontWeight: 600,
                    }}>
                        Income&nbsp; +₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div style={{
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.25)',
                        color: 'var(--danger)',
                        fontSize: 13,
                        fontWeight: 600,
                    }}>
                        Expenses&nbsp; -₹{totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div style={{
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        color: (totalIncome - totalExpense) >= 0 ? 'var(--success)' : 'var(--danger)',
                        fontSize: 13,
                        fontWeight: 700,
                    }}>
                        Net&nbsp; {(totalIncome - totalExpense) >= 0 ? '+' : ''}₹{(totalIncome - totalExpense).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                </div>
            )}

            {/* ── Error banner ── */}
            {error && (
                <div className="form-error" style={{ marginBottom: 20 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                </div>
            )}

            {/* ── Body ── */}
            <div className="tx-body">

                {/* Loading */}
                {loading && (
                    <div className="tx-state-box">
                        <div className="tx-spinner" />
                        <p className="tx-state-text">Loading transactions…</p>
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && transactions.length === 0 && (
                    <div className="tx-state-box">
                        <span style={{ fontSize: 40 }}>💸</span>
                        <p className="tx-state-text">No transactions yet.<br />Add one to get started!</p>
                        <button
                            className="btn-add"
                            onClick={() => navigate('/add')}
                            style={{ marginTop: 4 }}
                        >
                            + Add Transaction
                        </button>
                    </div>
                )}

                {/* List */}
                {!loading && transactions.length > 0 && (
                    <ul className="tx-list">
                        {transactions.map((t) => {
                            const isFading = deletingId === t.id
                            const isIncome = t.type === 'income'

                            return (
                                <li
                                    key={t.id}
                                    className={`tx-item${isFading ? ' tx-item--fading' : ''}`}
                                >
                                    {/* Category icon */}
                                    <div className="tx-icon-badge">
                                        {t.category_icon || '💰'}
                                    </div>

                                    {/* Description + date */}
                                    <div className="tx-info">
                                        <span className="tx-desc">
                                            {t.description || t.category || 'Transaction'}
                                        </span>
                                        <span className="tx-date">
                                            {t.category && (
                                                <span style={{ marginRight: 8, opacity: 0.7 }}>
                                                    {t.category}
                                                </span>
                                            )}
                                            {formatDate(t.created_at || t.date)}
                                        </span>
                                    </div>

                                    {/* Amount */}
                                    <span
                                        className="tx-amount"
                                        style={{ color: isIncome ? 'var(--success)' : 'var(--danger)' }}
                                    >
                                        {formatAmount(t.amount, t.type)}
                                    </span>

                                    {/* Delete button */}
                                    <button
                                        id={`btn-delete-${t.id}`}
                                        className="btn-delete"
                                        onClick={() => handleDelete(t.id)}
                                        disabled={isFading}
                                        title="Delete transaction"
                                        aria-label={`Delete transaction ${t.description}`}
                                    >
                                        {isFading
                                            ? <span className="tx-mini-spinner" />
                                            : <IconTrash />
                                        }
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default TransactionsPage