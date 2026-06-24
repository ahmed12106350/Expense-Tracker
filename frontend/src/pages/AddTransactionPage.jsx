import { useState, useEffect } from 'react';
import api from '../api/axios';

function AddTransactionPage() {
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [categoryId, setCategoryId] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/transactions/categories');
                const dbCategories = response.data;
                setCategories(dbCategories);
                if (dbCategories.length > 0) {
                    setCategoryId(dbCategories[0].id);
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
                setError('Could not load categories. Please refresh.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/transactions', {
                amount: parseFloat(amount),
                type,
                category_id: categoryId,
                description,
                date,
            });
            setSuccess('Transaction saved successfully!');
            setAmount('');
            setDescription('');
            setDate(new Date().toISOString().split('T')[0]);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save transaction.');
        } finally {
            setSubmitting(false);
        }
    };

    // Find selected category icon
    const selectedCat = categories.find(c => String(c.id) === String(categoryId));

    return (
        <div className="transaction-page">
            <div className="transaction-card">
                {/* Header */}
                <div className="transaction-header">
                    <div className="transaction-header-icon">➕</div>
                    <div>
                        <h1>New Transaction</h1>
                        <p>Record an income or expense</p>
                    </div>
                </div>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                        <div className="spinner" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)', margin: '0 auto 12px' }} />
                        <p style={{ fontSize: 14 }}>Loading categories…</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>

                        {/* Success / Error */}
                        {success && (
                            <div className="form-success">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                                {success}
                            </div>
                        )}
                        {error && (
                            <div className="form-error">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                {error}
                            </div>
                        )}

                        {/* Type Toggle */}
                        <div className="form-group">
                            <label className="form-label">Transaction type</label>
                            <div className="type-toggle">
                                <button
                                    type="button"
                                    className={`type-pill ${type === 'expense' ? 'active-expense' : ''}`}
                                    onClick={() => setType('expense')}
                                >
                                    📉 Expense
                                </button>
                                <button
                                    type="button"
                                    className={`type-pill ${type === 'income' ? 'active-income' : ''}`}
                                    onClick={() => setType('income')}
                                >
                                    📈 Income
                                </button>
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="amount">Amount</label>
                            <div className="input-wrapper">
                                <span className="input-icon" style={{ fontWeight: 600, fontSize: 15 }}>₹</span>
                                <input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                    className="form-input"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.5px' }}
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="category">Category</label>
                            <div className="input-wrapper">
                                <span className="input-icon" style={{ fontSize: 16 }}>
                                    {selectedCat?.icon || '🏷️'}
                                </span>
                                <select
                                    id="category"
                                    required
                                    className="form-input"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="description">Description <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" /></svg>
                                </span>
                                <input
                                    id="description"
                                    type="text"
                                    className="form-input"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="e.g. Grocery shopping"
                                />
                            </div>
                        </div>

                        {/* Date */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="date">Date</label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                </span>
                                <input
                                    id="date"
                                    type="date"
                                    required
                                    className="form-input"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={submitting}
                            style={{
                                background: type === 'income'
                                    ? 'linear-gradient(135deg, #10b981, #059669)'
                                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                boxShadow: type === 'income'
                                    ? '0 4px 14px rgba(16,185,129,0.35)'
                                    : '0 4px 14px rgba(99,102,241,0.35)',
                            }}
                        >
                            {submitting
                                ? <><span className="spinner" /> Saving…</>
                                : `Save ${type === 'income' ? 'Income' : 'Expense'}`
                            }
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default AddTransactionPage;
