const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5001';
    }
  }
  if (process.env.NODE_ENV === 'development' && !process.env.VERCEL) {
    return 'http://localhost:5001';
  }
  return (process.env.NEXT_PUBLIC_API_URL || 'https://evans-backend-3oyy.onrender.com').replace(/\/$/, '');
};

const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;
