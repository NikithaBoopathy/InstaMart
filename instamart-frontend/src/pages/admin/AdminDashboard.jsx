import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import Spinner from '../../components/common/Spinner'

const STATUS_BADGE = { PLACED:'info', CONFIRMED:'info', PACKED:'warning', OUT_FOR_DELIVERY:'warning', DELIVERED:'success', CANCELLED:'danger' }
const STATUSES = ['PLACED','CONFIRMED','PACKED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED']

export default function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [tab, setTab] = useState('orders')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/admin/orders'), api.get('/products?size=50')])
      .then(([o, p]) => { setOrders(o.data.content || []); setProducts(p.data.content || []) })
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (orderId, status) => {
    await api.put(`/admin/orders/${orderId}/status?status=${status}`)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
  }

  if (loading) return <Spinner />

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 48 }}>
      <h2 style={{ marginBottom: 24 }}>Admin Dashboard</h2>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20, flex: 1, textAlign: 'center' }}>
          <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)' }}>{orders.length}</p>
          <p style={{ color: 'var(--gray-400)' }}>Total Orders</p>
        </div>
        <div className="card" style={{ padding: 20, flex: 1, textAlign: 'center' }}>
          <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--success)' }}>{orders.filter(o => o.status === 'DELIVERED').length}</p>
          <p style={{ color: 'var(--gray-400)' }}>Delivered</p>
        </div>
        <div className="card" style={{ padding: 20, flex: 1, textAlign: 'center' }}>
          <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--secondary)' }}>{products.length}</p>
          <p style={{ color: 'var(--gray-400)' }}>Products</p>
        </div>
        <div className="card" style={{ padding: 20, flex: 1, textAlign: 'center' }}>
          <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--accent)', filter: 'brightness(.8)' }}>
            ₹{orders.reduce((s, o) => s + Number(o.totalAmount || 0), 0).toFixed(0)}
          </p>
          <p style={{ color: 'var(--gray-400)' }}>Revenue</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['orders','products'].map(t => (
          <button key={t} className={`btn ${tab === t ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'orders' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--gray-50)' }}>
                {['Order ID','Customer','Amount','Status','Action'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: 'var(--gray-600)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} style={{ borderTop: '1px solid var(--gray-100)' }}>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600 }}>#{order.id.slice(0,8).toUpperCase()}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>{order.user?.name || order.user?.email || '-'}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700 }}>₹{order.totalAmount}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge badge-${STATUS_BADGE[order.status] || 'info'}`}>{order.status?.replace(/_/g,' ')}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                      style={{ padding: '6px 10px', border: '1px solid var(--gray-200)', borderRadius: 6, fontSize: 13, fontFamily: 'DM Sans, sans-serif', cursor: 'pointer' }}>
                      {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'products' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--gray-50)' }}>
                {['Product','Brand','Price','MRP','Stock','Status'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: 'var(--gray-600)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid var(--gray-100)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={p.imageUrl} style={{ width: 36, height: 36, objectFit: 'contain' }} onError={e => e.target.src = 'https://via.placeholder.com/36'} />
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>{p.brand}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700 }}>₹{p.price}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--gray-400)', textDecoration: 'line-through', fontSize: 13 }}>₹{p.mrp}</td>
                  <td style={{ padding: '14px 16px', fontSize: 13 }}>{p.stockQuantity}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge badge-${p.isActive ? 'success' : 'danger'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
