import API_BASE_URL from '@/config/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (mobile, password) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/api/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }

          set({ user: data, token: data.token, loading: false });
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      register: async (username, email, mobile, password) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/api/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, mobile, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
          }

          set({ user: data, token: data.token, loading: false });
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      fetchProfile: async () => {
        const { token } = useAuthStore.getState();
        if (!token) return;

        try {
          const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
            headers: { 
              'Authorization': `Bearer ${token}` 
            },
          });
          const data = await response.json();
          if (response.ok) {
            set((state) => ({ user: { ...state.user, ...data } }));
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      },

      addAddress: async (addressData) => {
        const { token } = useAuthStore.getState();
        if (!token) return;

        set({ loading: true });
        try {
          const response = await fetch(`${API_BASE_URL}/api/users/addresses`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(addressData),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.message);

          set((state) => ({ 
            user: { ...state.user, addresses: data },
            loading: false 
          }));
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      updateAddress: async (id, addressData) => {
        const { token } = useAuthStore.getState();
        if (!token) return;

        set({ loading: true });
        try {
          const response = await fetch(`${API_BASE_URL}/api/users/addresses/${id}`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(addressData),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.message);

          set((state) => ({ 
            user: { ...state.user, addresses: data },
            loading: false 
          }));
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      deleteAddress: async (id) => {
        const { token } = useAuthStore.getState();
        if (!token) return;

        set({ loading: true });
        try {
          const response = await fetch(`${API_BASE_URL}/api/users/addresses/${id}`, {
            method: 'DELETE',
            headers: { 
              'Authorization': `Bearer ${token}` 
            },
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.message);

          set((state) => ({ 
            user: { ...state.user, addresses: data },
            loading: false 
          }));
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      updateProfile: async (profileData) => {
        const { token } = useAuthStore.getState();
        if (!token) return;

        set({ loading: true });
        try {
          const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(profileData),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.message);

          set((state) => ({ 
            user: { ...state.user, ...data },
            loading: false 
          }));
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      forgotPassword: async (mobile) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/api/users/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message);
          set({ loading: false });
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      verifyOTP: async (mobile, otp) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/api/users/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile, otp }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message);
          set({ loading: false });
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      resetPassword: async (resetData) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/api/users/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(resetData),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message);
          set({ loading: false });
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      changePassword: async (passwords) => {
        const { token } = useAuthStore.getState();
        if (!token) return;
        set({ loading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/api/users/change-password`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(passwords),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message);
          set({ loading: false });
          return data;
        } catch (error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'evans-auth-storage',
    }
  )
);

