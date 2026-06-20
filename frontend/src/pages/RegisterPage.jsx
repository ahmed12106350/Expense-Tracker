import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const RegisterLogin = async () => {
        try {
            const response = await api.post('/auth/register', { email, password })

            navigate('/login')
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong')
        }
    }

    return (
        <div>
            <h1>Register</h1>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {error && <p>{error}</p>}
            <button onClick={RegisterLogin}>Register</button>
            <p>Already have an account?<a href="/login">Login</a></p>
        </div>
    )
}

export default RegisterPage