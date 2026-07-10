// Central API base URL - automatically uses production on Render, localhost in dev
let API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// For local network mobile testing, dynamically use the network IP address
if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && !window.location.hostname.includes('vercel.app')) {
  API_BASE_URL = `http://${window.location.hostname}:5001`;
}

export default API_BASE_URL;
