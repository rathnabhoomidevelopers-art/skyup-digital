export { Page }
import { Login } from '@/components/Login'
import { AuthProvider } from '@/context/AuthContext'

function Page() {
  return (
    <AuthProvider>
      <Login />
    </AuthProvider>
  )
}