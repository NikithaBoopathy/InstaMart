import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useCart } from '../contexts/CartContext'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState([])
  const [selectedAddr, setSelectedAddr] = useState(null)
  const [placing, setPlacing] = useState(false)
  const [newAddr, setNewAddr] = useState({ label: 'Home', addressLine1: '', city: '', state: '', pincode: '' })
  const [showForm, setShowForm] = useState(false)
  const { cart, total, fetchCart } = useCart()
  const navigate = useNavigate()
  const deliveryFee = total >= 199 ? 0 : 30

  useEffect(() => {
    fetchCart()
    api.get('/addresses').then(({ data }) => {
      setAddresses(data)
      const def = data.find(a => a.isDefault) || data[0]
      if (def) setSelectedAddr(def.id)
    })
  }, [])

  const addAddress = async () => {
    const { data } = await api.post('/addresses', { ...newAddr, isDefault: addresses.length === 0 })
    setAddresses(prev => [...prev, data])
    setSelectedAddr(data.id)
    setShowForm(false)
    toast.success('Address saved')
  }

  const placeOrder = async () => {
    if (!selectedAddr) { toast.error('Select a delivery address'); return }
    setPlacing(true)
    try {
      const { data } = await api.post('/orders', { addressId: selectedAddr, paymentMethod: 'MOCK' })
      toast.success('Order placed! 🎉')
      navigate(`/orders/${data.id}`)
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to place order')
    } finally { setPlacing(false) }
  }

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 48, maxWidth: 800 }}>
      <h2 style={{ marginBottom: 24 }}>Checkout</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        <div>
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <h3 style={{ marginBottom: 16 }}>Delivery Address</h3>
            {addresses.map(addr => (
              <div key={addr.id} onClick={() => setSelectedAddr(addr.id)}
                style={{ padding: 14, border: `2px solid ${selectedAddr === addr.id ? 'var(--primary)' : 'var(--gray-200)'}`, borderRadius: 10, marginBottom: 10, cursor: 'pointer', transition: 'border-color .2s' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                  <span className="badge badge-info">{addr.label}</span>
                  <span style={{ fontWeight: 600 }}>{addr.addressLine1}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--gray-600)' }}>{addr.city}, {addr.state} - {addr.pincode}</p>
              </div>
            ))}
            <button className="btn btn-secondary btn-sm" onClick={() => setShowForm(!showForm)}>+ Add New Address</button>
            {showForm && (
              <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
                {['addressLine1','city','state','pincode'].map(f => (
                  <input key={f} placeholder={f.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                    value={newAddr[f]} onChange={e => setNewAddr(prev => ({ ...prev, [f]: e.target.value }))}
                    style={{ padding: '10px 14px', border: '1.5px solid var(--gray-200)', borderRadius: 8, fontFamily: 'DM Sans, sans-serif' }} />
                ))}
                <button className="btn btn-primary btn-sm" onClick={addAddress}>Save Address</button>
              </div>
            )}
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ marginBottom: 16 }}>Payment</h3>
            <div style={{ padding: 14, border: '2px solid var(--primary)', borderRadius: 10, background: 'var(--primary-light)' }}>
              <span style={{ fontWeight: 600 }}>💳 Mock Payment (Test Mode)</span>
              <p style={{ fontSize: 13, color: 'var(--gray-600)', marginTop: 4 }}>Order will be instantly confirmed</p>
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{ padding: 20, position: 'sticky', top: 80 }}>
            <h3 style={{ marginBottom: 16 }}>Order Summary</h3>
            {cart?.items?.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
                <span>{item.product.name} × {item.quantity}</span>
                <span>₹{(item.product.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
            <hr style={{ border: 'none', borderTop: '1px dashed var(--gray-200)', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Subtotal</span><span>₹{total.toFixed(0)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span>Delivery</span><span style={{ color: deliveryFee === 0 ? 'var(--success)' : 'inherit' }}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 20, marginBottom: 20 }}>
              <span>Total</span><span>₹{(total + deliveryFee).toFixed(0)}</span>
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}
              onClick={placeOrder} disabled={placing}>
              {placing ? 'Placing...' : 'Place Order 🎉'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
