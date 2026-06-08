import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.phone)
      toast.success('Account created! 🎉')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally { setLoading(false) }
  }

  const inputStyle = { width: '100%', padding: '12px 16px', border: '1.5px solid var(--gray-200)', borderRadius: 10, fontSize: 15, fontFamily: 'DM Sans, sans-serif', outline: 'none' }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #fff1ec 0%, #fff 100%)' }}>
      <div className="card" style={{ padding: 40, width: '100%', maxWidth: 420 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Create Account ✨</h2>
        <p style={{ textAlign: 'center', color: 'var(--gray-400)', marginBottom: 28 }}>Join Instamart today</p>
        <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[['name','text','Full Name'],['email','email','Email'],['phone','tel','Phone (optional)'],['password','password','Password (min 6 chars)']].map(([f, t, ph]) => (
            <input key={f} style={inputStyle} type={t} placeholder={ph} value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} required={f !== 'phone'} />
          ))}
          <button type="submit" className="btn btn-primary btn-lg" style={{ justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--gray-600)' }}>Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link></p>
      </div>
    </div>
  )
}
