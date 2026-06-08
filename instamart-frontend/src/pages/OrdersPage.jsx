import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import Spinner from '../components/common/Spinner'

const STATUS_BADGE = { PLACED:'info', CONFIRMED:'info', PACKED:'warning', OUT_FOR_DELIVERY:'warning', DELIVERED:'success', CANCELLED:'danger' }

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data.content || [])).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 48, maxWidth: 760 }}>
      <h2 style={{ marginBottom: 24 }}>My Orders</h2>
      {orders.length === 0
        ? <div className="page-center" style={{ flexDirection: 'column', gap: 12 }}><span style={{ fontSize: 64 }}>📦</span><p>No orders yet</p><Link to="/"><button className="btn btn-primary">Start Shopping</button></Link></div>
        : orders.map(order => (
          <Link to={`/orders/${order.id}`} key={order.id}>
            <div className="card" style={{ padding: 18, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform .2s', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}>
              <div>
                <p style={{ fontWeight: 600, marginBottom: 4 }}>Order #{order.id.slice(0, 8).toUpperCase()}</p>
                <p style={{ fontSize: 13, color: 'var(--gray-400)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span className={`badge badge-${STATUS_BADGE[order.status] || 'info'}`}>{order.status?.replace(/_/g, ' ')}</span>
              </div>
              <p style={{ fontWeight: 700, fontSize: 18 }}>₹{order.totalAmount}</p>
            </div>
          </Link>
        ))}
    </div>
  )
}
