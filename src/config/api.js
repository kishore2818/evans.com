const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      host.startsWith('172.') ||
      host.endsWith('.local')
    ) {
      return `http://${host}:5001`;
    }
  }
  if (process.env.NODE_ENV === 'development' && !process.env.VERCEL) {
    return 'http://localhost:5001';
  }
  return (process.env.NEXT_PUBLIC_API_URL || 'https://evans-backend-3oyy.onrender.com').replace(/\/$/, '');
};

const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;

