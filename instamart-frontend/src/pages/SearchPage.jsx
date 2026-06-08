import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import ProductCard from '../components/products/ProductCard'
import Spinner from '../components/common/Spinner'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!q) return
    setLoading(true)
    api.get(`/products/search?q=${encodeURIComponent(q)}`).then(({ data }) => {
      setProducts(data.content || [])
    }).finally(() => setLoading(false))
  }, [q])

  if (loading) return <Spinner />

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 48 }}>
      <h2 style={{ marginBottom: 20 }}>Results for "{q}" <span style={{ fontSize: 16, color: 'var(--gray-400)', fontWeight: 400 }}>({products.length} items)</span></h2>
      {products.length === 0
        ? <div className="page-center" style={{ flexDirection: 'column', gap: 8 }}><span style={{ fontSize: 48 }}>🔍</span><p>No products found</p></div>
        : <div className="grid-products">{products.map(p => <ProductCard key={p.id} product={p} />)}</div>}
    </div>
  )
}
