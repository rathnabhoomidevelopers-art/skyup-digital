const API_URL = import.meta.env.DEV 
  ? 'http://localhost:3500'
  : ''  // empty = uses Vercel proxy /api/... in production

export default API_URL