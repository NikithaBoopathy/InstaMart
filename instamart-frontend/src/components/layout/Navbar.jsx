import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { fetchCart, itemCount } = useCart()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => { if (user) fetchCart() }, [user])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <nav style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,.08)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 20, height: 64 }}>
        <Link to="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--primary)', flexShrink: 0 }}>
          ⚡ instamart
        </Link>

        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 480, position: 'relative' }}>
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search groceries, vegetables, snacks..."
            style={{ width: '100%', padding: '10px 16px 10px 42px', border: '1.5px solid var(--gray-200)', borderRadius: 99, fontSize: 14, outline: 'none', fontFamily: 'DM Sans, sans-serif' }} />
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
          {user ? (
            <>
              {isAdmin && <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: 'var(--gray-600)' }}><LayoutDashboard size={16} />Admin</Link>}
              <Link to="/orders" style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-600)' }}>Orders</Link>
              <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <button className="btn btn-primary btn-sm">
                  <ShoppingCart size={16} /> Cart
                  {itemCount > 0 && (
                    <span style={{ background: 'var(--accent)', color: '#000', borderRadius: 99, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>{itemCount}</span>
                  )}
                </button>
              </Link>
              <button onClick={() => { logout(); navigate('/') }} style={{ background: 'none', color: 'var(--gray-400)', display: 'flex', alignItems: 'center' }}>
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link to="/login"><button className="btn btn-primary btn-sm"><User size={16} />Login</button></Link>
          )}
        </div>
      </div>
    </nav>
  )
}
