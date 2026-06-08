import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import ProductCard from '../components/products/ProductCard'
import Spinner from '../components/common/Spinner'

export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/categories'), api.get('/products/featured')])
      .then(([cats, prods]) => { setCategories(cats.data); setFeatured(prods.data) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 48 }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(120deg, var(--primary) 0%, #ff8c5a 100%)', borderRadius: 20, padding: '36px 40px', marginBottom: 36, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 8 }}>Groceries in<br />30 minutes ⚡</h1>
          <p style={{ opacity: .85, marginBottom: 20 }}>Fresh produce, snacks & daily essentials</p>
          <Link to="/products"><button className="btn" style={{ background: 'white', color: 'var(--primary)', fontWeight: 700 }}>Shop Now →</button></Link>
        </div>
        <span style={{ fontSize: 96 }}>🛒</span>
      </div>

      {/* Categories */}
      <h2 style={{ marginBottom: 16 }}>Shop by Category</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12, marginBottom: 40 }}>
        {categories.map(cat => (
          <Link to={`/category/${cat.id}?name=${encodeURIComponent(cat.name)}`} key={cat.id}>
            <div className="card" style={{ padding: 16, textAlign: 'center', cursor: 'pointer', transition: 'transform .2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}>
              <img src={cat.imageUrl} alt={cat.name} style={{ width: 48, height: 48, marginBottom: 8 }}
                onError={e => e.target.src = 'https://via.placeholder.com/48'} />
              <p style={{ fontSize: 13, fontWeight: 600 }}>{cat.name}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Featured */}
      <h2 style={{ marginBottom: 16 }}>Featured Products</h2>
      <div className="grid-products">
        {featured.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}
