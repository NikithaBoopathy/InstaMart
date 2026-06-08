import { createContext, useContext, useState, useCallback } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data } = await api.get('/cart')
      setCart(data)
    } finally { setLoading(false) }
  }, [user])

  const updateItem = async (productId, quantity) => {
    if (!user) { toast.error('Please login first'); return }
    const { data } = await api.post('/cart', { productId, quantity })
    setCart(data)
    if (quantity > 0) toast.success('Cart updated')
    else toast.success('Removed from cart')
  }

  const addItem = (productId) => updateItem(productId, (getQty(productId) || 0) + 1)
  const removeItem = (productId) => updateItem(productId, 0)
  const setQty = (productId, qty) => updateItem(productId, qty)

  const getQty = (productId) => {
    if (!cart) return 0
    return cart.items?.find(i => i.product.id === productId)?.quantity || 0
  }

  const itemCount = cart?.items?.reduce((s, i) => s + i.quantity, 0) || 0
  const total = cart?.items?.reduce((s, i) => s + (i.product.price * i.quantity), 0) || 0

  return <CartContext.Provider value={{ cart, loading, fetchCart, addItem, removeItem, setQty, getQty, itemCount, total }}>
    {children}
  </CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
