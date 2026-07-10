import API_BASE_URL from '@/config/api';
import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';

export const useStore = create((set, get) => ({
  cart: [],
  wishlist: [],
  myOrders: [],
  storeSettings: { shippingFee: 150, freeShippingThreshold: 2000 },
  
  addToCart: (product, quantity = 1) => set((state) => {
    const maxStock = product.stock !== undefined ? product.stock : 9999;
    const existing = state.cart.find((item) => item.id === (product.id || product._id));
    if (existing) {
      const newQty = Math.min(maxStock, existing.quantity + quantity);
      return {
        cart: state.cart.map((item) =>
          item.id === (product.id || product._id)
            ? { ...item, quantity: newQty }
            : item
        ),
      };
    }
    const cappedQty = Math.min(maxStock, quantity);
    return { cart: [...state.cart, { ...product, id: product.id || product._id, quantity: cappedQty }] };
  }),
  
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== productId),
  })),
  
  updateQuantity: (productId, quantity) => set((state) => ({
    cart: state.cart.map((item) =>
      item.id === productId 
        ? { ...item, quantity: Math.min(item.stock || 999, Math.max(1, quantity)) } 
        : item
    ),
  })),

  
  clearCart: () => set({ cart: [] }),

  // Settings Logic
  fetchStoreSettings: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings`);
      const data = await res.json();
      if (res.ok && data) {
        set({ storeSettings: data });
      }
    } catch (err) {
      console.error('Settings fetch error', err);
    }
  },

  // Wishlist Logic
  fetchWishlist: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/wishlist`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) set({ wishlist: data.map(p => p._id) });
    } catch (err) {
      console.error('Wishlist fetch error', err);
    }
  },

  toggleWishlist: async (productId) => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/wishlist/toggle`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ productId })
      });
      if (res.ok) {
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter(id => id !== productId)
            : [...state.wishlist, productId]
        }));
      }
    } catch (err) {
      console.error('Wishlist toggle error', err);
    }
  },

  // Order Logic
  placeOrder: async (orderData) => {
    const token = useAuthStore.getState().token;
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (!res.ok) {
        const err = new Error(data.message);
        err.productId = data.productId;
        err.availableStock = data.availableStock;
        throw err;
      }
      set({ cart: [] });
      return data;
    } catch (err) {
      throw err;
    }
  },

  createRazorpayOrder: async (amount) => {
    const token = useAuthStore.getState().token;
    try {
      const res = await fetch(`${API_BASE_URL}/api/payment/checkout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create payment order');
      return data;
    } catch (err) {
      throw err;
    }
  },

  verifyPayment: async (paymentData) => {
    const token = useAuthStore.getState().token;
    try {
      const res = await fetch(`${API_BASE_URL}/api/payment/verify`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(paymentData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Payment verification failed');
      return data;
    } catch (err) {
      throw err;
    }
  },

  fetchMyOrders: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/myorders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) set({ myOrders: data });
    } catch (err) {
      console.error('Fetch orders error', err);
    }
  },

  // Review Logic
  addReview: async (productId, reviewData) => {
    const token = useAuthStore.getState().token;
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(reviewData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    } catch (err) {
      throw err;
    }
  }
}));
