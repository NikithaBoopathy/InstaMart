import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name}!`)
      navigate(user.role === 'ADMIN' ? '/admin' : '/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
    } finally { setLoading(false) }
  }

  const inputStyle = { width: '100%', padding: '12px 16px', border: '1.5px solid var(--gray-200)', borderRadius: 10, fontSize: 15, fontFamily: 'DM Sans, sans-serif', outline: 'none' }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #fff1ec 0%, #fff 100%)' }}>
      <div className="card" style={{ padding: 40, width: '100%', maxWidth: 420 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Welcome back 👋</h2>
        <p style={{ textAlign: 'center', color: 'var(--gray-400)', marginBottom: 28 }}>Sign in to continue</p>
        <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input style={inputStyle} type="email" placeholder="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
          <input style={inputStyle} type="password" placeholder="Password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
          <button type="submit" className="btn btn-primary btn-lg" style={{ justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--gray-600)' }}>Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register</Link></p>
        <p style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: 'var(--gray-400)' }}>Admin: admin@instamart.com / Admin@123</p>
      </div>
    </div>
  )
}
