export { Page }
import { Receipt } from '@/pages/Receipt'
import { AuthProvider } from '@/context/AuthContext'

function Page() {
  return (
    <AuthProvider>
      <Receipt />
    </AuthProvider>
  )
}