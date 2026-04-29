import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../features/auth'
import {
  clearCartItems,
  listCartItems,
  removeCartItem,
  updateCartItemQty,
  upsertCartItem,
} from '../../features/user/services/orderApi'

const CartContext = createContext({
  cartItems: [],
  cartCount: 0,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateCartItemQuantity: async () => {},
  clearCart: async () => {},
  getCartTotal: () => 0,
  hasProductInCart: () => false,
  refreshCart: async () => {},
})

export function CartProvider({ children }) {
  const { accessToken, isAuthenticated } = useAuth()
  const [cartItems, setCartItems] = useState([])

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated || !accessToken) {
      setCartItems([])
      return []
    }
    const items = await listCartItems(accessToken)
    setCartItems(items || [])
    return items || []
  }, [accessToken, isAuthenticated])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const addToCart = async (product, quantity = 1) => {
    if (!accessToken) return
    const productId = Number(product?.productId || product?.id)
    const qty = Math.max(1, Number(quantity) || 1)
    if (!Number.isInteger(productId) || productId <= 0) return
    await upsertCartItem(accessToken, productId, qty)
    const items = await refreshCart()
    return items.find((item) => item.product_id === productId) || null
  }

  const removeFromCartAction = async (productId) => {
    if (!accessToken) return
    await removeCartItem(accessToken, Number(productId))
    await refreshCart()
  }

  const updateCartItemQuantity = async (productId, quantity) => {
    if (!accessToken) return
    const qty = Math.max(1, Number(quantity) || 1)
    await updateCartItemQty(accessToken, Number(productId), qty)
    await refreshCart()
  }

  const clearCart = async () => {
    if (!accessToken) return
    await clearCartItems(accessToken)
    await refreshCart()
  }

  const cartCount = cartItems.reduce((total, item) => total + Number(item.qty || 0), 0)
  const getCartTotal = () => cartItems.reduce((total, item) => total + Number(item.line_total || 0), 0)
  const hasProductInCart = (productId) => cartItems.some((item) => item.product_id === Number(productId))

  const value = useMemo(() => ({
    cartItems,
    cartCount,
    addToCart,
    removeFromCart: removeFromCartAction,
    updateCartItemQuantity,
    clearCart,
    getCartTotal,
    hasProductInCart,
    refreshCart,
  }), [cartItems, cartCount, refreshCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
