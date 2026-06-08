import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import Spinner from '../components/common/Spinner'
import { CheckCircle, Package, Truck, Clock } from 'lucide-react'

const STEPS = ['PLACED','CONFIRMED','PACKED','OUT_FOR_DELIVERY','DELIVERED']
const STEP_ICON = [Clock, CheckCircle, Package, Truck, CheckCircle]

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <Spinner />
  if (!order) return <div className="page-center">Order not found</div>

  const stepIndex = STEPS.indexOf(order.status)

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 48, maxWidth: 760 }}>
      <h2 style={{ marginBottom: 8 }}>Order #{order.id.slice(0, 8).toUpperCase()}</h2>
      <p style={{ color: 'var(--gray-400)', marginBottom: 24 }}>{new Date(order.createdAt).toLocaleString('en-IN')}</p>

      {/* Tracker */}
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <h3 style={{ marginBottom: 20 }}>Tracking</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {STEPS.map((step, i) => {
            const Icon = STEP_ICON[i]
            const done = i <= stepIndex
            return (
              <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                {i < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', top: 18, left: '50%', width: '100%', height: 3, background: i < stepIndex ? 'var(--primary)' : 'var(--gray-200)', zIndex: 0 }} />
                )}
                <div style={{ background: done ? 'var(--primary)' : 'var(--gray-200)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, transition: 'background .3s' }}>
                  <Icon size={16} color={done ? 'white' : '#9ca3af'} />
                </div>
                <p style={{ fontSize: 11, marginTop: 6, color: done ? 'var(--primary)' : 'var(--gray-400)', fontWeight: done ? 600 : 400, textAlign: 'center' }}>
                  {step.replace(/_/g, ' ')}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Items */}
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 style={{ marginBottom: 16 }}>Items</h3>
        {order.items?.map(item => (
          <div key={item.id} style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
            <img src={item.productImage} alt={item.productName} style={{ width: 56, height: 56, objectFit: 'contain', background: 'var(--gray-50)', borderRadius: 8, padding: 4 }}
              onError={e => e.target.src = 'https://via.placeholder.com/56'} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600 }}>{item.productName}</p>
              <p style={{ fontSize: 13, color: 'var(--gray-400)' }}>{item.unit} × {item.quantity}</p>
            </div>
            <p style={{ fontWeight: 700 }}>₹{item.totalPrice}</p>
          </div>
        ))}
        <hr style={{ border: 'none', borderTop: '1px dashed var(--gray-200)', margin: '12px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>₹{order.subtotal}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Delivery</span><span>{order.deliveryFee == 0 ? 'FREE' : `₹${order.deliveryFee}`}</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18, marginTop: 8 }}><span>Total</span><span>₹{order.totalAmount}</span></div>
      </div>
    </div>
  )
}
