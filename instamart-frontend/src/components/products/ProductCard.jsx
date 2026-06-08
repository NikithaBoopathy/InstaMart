import { useCart } from '../../contexts/CartContext'
import { Plus, Minus } from 'lucide-react'

export default function ProductCard({ product }) {
  const { getQty, addItem, setQty, removeItem } = useCart()
  const qty = getQty(product.id)
  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0

  return (
    <div className="card" style={{ overflow: 'hidden', transition: 'transform .2s, box-shadow .2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
      <div style={{ position: 'relative', background: 'var(--gray-50)', padding: 16, textAlign: 'center' }}>
        {discount > 0 && <span className="badge badge-success" style={{ position: 'absolute', top: 8, left: 8 }}>{discount}% OFF</span>}
        <img src={product.imageUrl} alt={product.name} style={{ width: 80, height: 80, objectFit: 'contain' }}
          onError={e => e.target.src = 'https://via.placeholder.com/80'} />
      </div>
      <div style={{ padding: '12px 14px' }}>
        <p style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 2 }}>{product.unit}</p>
        <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, lineHeight: 1.3 }}>{product.name}</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>₹{product.price}</span>
          {discount > 0 && <span style={{ fontSize: 12, color: 'var(--gray-400)', textDecoration: 'line-through' }}>₹{product.mrp}</span>}
        </div>
        {qty === 0 ? (
          <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => addItem(product.id)}>
            <Plus size={14} /> Add
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--primary)', borderRadius: 8, padding: '2px 4px' }}>
            <button style={{ background: 'none', color: 'white', padding: '4px 8px', borderRadius: 6 }}
              onClick={() => qty === 1 ? removeItem(product.id) : setQty(product.id, qty - 1)}>
              <Minus size={14} />
            </button>
            <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{qty}</span>
            <button style={{ background: 'none', color: 'white', padding: '4px 8px', borderRadius: 6 }}
              onClick={() => setQty(product.id, qty + 1)}>
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
