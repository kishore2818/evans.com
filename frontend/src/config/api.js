// Central API base URL - uses NEXT_PUBLIC_API_URL in production, localhost in dev
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default API_BASE_URL;
