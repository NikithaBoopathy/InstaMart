import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'

export default function CartPage() {
  const { cart, fetchCart, removeItem, setQty, itemCount, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { if (user) fetchCart() }, [user])

  if (!user) return (
    <div className="page-center" style={{ flexDirection: 'column', gap: 16 }}>
      <span style={{ fontSize: 64 }}>🛒</span>
      <p>Please <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>login</Link> to view your cart</p>
    </div>
  )

  const items = cart?.items || []
  const deliveryFee = total >= 199 ? 0 : 30

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 48, maxWidth: 800 }}>
      <h2 style={{ marginBottom: 24 }}>My Cart {itemCount > 0 && `(${itemCount} items)`}</h2>
      {items.length === 0 ? (
        <div className="page-center" style={{ flexDirection: 'column', gap: 16 }}>
          <span style={{ fontSize: 64 }}>🛒</span>
          <p style={{ color: 'var(--gray-400)' }}>Your cart is empty</p>
          <Link to="/"><button className="btn btn-primary">Start Shopping</button></Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {items.map(item => (
            <div key={item.id} className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
              <img src={item.product.imageUrl} alt={item.product.name} style={{ width: 64, height: 64, objectFit: 'contain', background: 'var(--gray-50)', borderRadius: 8, padding: 4 }}
                onError={e => e.target.src = 'https://via.placeholder.com/64'} />
              <div style={{ flex: 1 }}>
                <h4 style={{ marginBottom: 4 }}>{item.product.name}</h4>
                <p style={{ fontSize: 13, color: 'var(--gray-400)' }}>{item.product.unit}</p>
                <p style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{item.product.price}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => item.quantity > 1 ? setQty(item.product.id, item.quantity - 1) : removeItem(item.product.id)}>-</button>
                <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                <button className="btn btn-secondary btn-sm" onClick={() => setQty(item.product.id, item.quantity + 1)}>+</button>
              </div>
              <div style={{ textAlign: 'right', minWidth: 80 }}>
                <p style={{ fontWeight: 700 }}>₹{(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
              <button onClick={() => removeItem(item.product.id)} style={{ background: 'none', color: 'var(--gray-400)' }}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          <div className="card" style={{ padding: 20, marginTop: 8 }}>
            <h3 style={{ marginBottom: 16 }}>Bill Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>₹{total.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery Fee</span>
                <span style={{ color: deliveryFee === 0 ? 'var(--success)' : 'inherit' }}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              {total < 199 && <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>Add ₹{(199 - total).toFixed(0)} more for free delivery</p>}
              <hr style={{ border: 'none', borderTop: '1px dashed var(--gray-200)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
                <span>Total</span><span>₹{(total + deliveryFee).toFixed(2)}</span>
              </div>
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}
              onClick={() => navigate('/checkout')}>
              Proceed to Checkout →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
