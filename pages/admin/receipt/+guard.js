// pages/admin/receipt/+guard.js
export { guard }

async function guard(pageContext) {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('adminToken')
    : null

  if (!token) {
    return { redirect: '/admin' }
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))

    // Only admin can access receipt
    if (payload.role !== 'admin') {
      return { redirect: '/admin' }  // blogger gets redirected away
    }
  } catch {
    return { redirect: '/admin' }
  }
}