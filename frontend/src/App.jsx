import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import TransactionsPage from './pages/TransactionsPage'
import AddTransactionPage from './pages/AddTransactionPage'
import ThemeToggle from './components/ThemeToggle'

function App() {
  // MUST be useState so route guards re-render when token changes
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  //const handleLogout = () => {
  // localStorage.removeItem('token')
  ///setToken(null)
  //}

  return (
    <>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
        <Route path="/dashboard" element={token ? <Dashboard onLogout={() => { localStorage.removeItem('token'); setToken(null) }} /> : <Navigate to="/login" />} />
        <Route path="/transactions" element={token ? <TransactionsPage /> : <Navigate to="/login" replace />} />
        <Route path="/add" element={token ? <AddTransactionPage /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
      </Routes>
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
        <ThemeToggle />
      </div>
    </>
  )
}

export default App