import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartAPI } from '../services/api';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const { isAuthenticated } = useAuth();

  // Load cart from backend on mount and authentication state changes
  const fetchCart = async () => {
    if (!isAuthenticated) {
      dispatch({ type: 'LOAD_CART', payload: [] });
      return;
    }
    try {
      const resp = await cartAPI.getCartItems();
      const formatted = Array.isArray(resp.data) ? resp.data.map(item => ({
        id: item.productId,
        name: item.productName || 'Medical Product',
        category: item.productCategory || 'Unknown Category',
        price: Number(item.productPrice) || 0,
        stock: Number(item.productStock) || 0,
        image: item.productImageUrl || '/api/placeholder/300/300',
        quantity: item.quantity,
        cartItemId: item.id
      })) : [];
      
      dispatch({ type: 'LOAD_CART', payload: formatted });
    } catch (error) {
      console.error('Error loading cart from server:', error);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    try {
      await cartAPI.addToCart(product.id, quantity);
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;
    const item = state.items.find(i => i.id === productId);
    if (!item) return;
    try {
      await cartAPI.removeFromCart(item.cartItemId);
      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: productId
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) return;
    const item = state.items.find(i => i.id === productId);
    if (!item) return;
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    try {
      await cartAPI.updateCartItem(item.cartItemId, quantity);
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id: productId, quantity }
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;
    try {
      await cartAPI.clearCart();
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems: state.items,
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { CartContext };
export default CartContext;
