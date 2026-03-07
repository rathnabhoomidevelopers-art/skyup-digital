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
    if (payload.role !== 'blogger' && payload.role !== 'admin') {
      return { redirect: '/admin' }
    }
  } catch {
    return { redirect: '/admin' }
  }
}