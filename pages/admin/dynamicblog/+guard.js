// pages/admin/dynamicblog/+guard.js
export { guard }

async function guard(pageContext) {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('adminToken') 
    : null

  if (!token) {
    return { redirect: '/admin' }  // redirect to login
  }

  // Decode role from token without verifying (verification happens server-side)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    
    // Only blogger and admin can access dynamicblog
    if (payload.role !== 'blogger' && payload.role !== 'admin') {
      return { redirect: '/admin' }
    }
  } catch {
    return { redirect: '/admin' }
  }
}