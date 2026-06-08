import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import ProductCard from '../components/products/ProductCard'
import Spinner from '../components/common/Spinner'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [searchParams] = useSearchParams()
  const categoryId = searchParams.get('category')
  const categoryName = searchParams.get('name') || 'All Products'

  useEffect(() => {
    setLoading(true)
    const url = categoryId ? `/products/category/${categoryId}?page=${page}` : `/products?page=${page}`
    api.get(url).then(({ data }) => {
      setProducts(data.content || data)
      setTotalPages(data.totalPages || 1)
    }).finally(() => setLoading(false))
  }, [page, categoryId])

  if (loading) return <Spinner />

  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 48 }}>
      <h2 style={{ marginBottom: 20 }}>{categoryName}</h2>
      <div className="grid-products">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i)} className="btn btn-sm"
              style={{ background: i === page ? 'var(--primary)' : 'white', color: i === page ? 'white' : 'var(--gray-800)', border: '1px solid var(--gray-200)' }}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
