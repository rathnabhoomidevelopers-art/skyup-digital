export { Layout }
import '../../src/index.css'
import { AuthProvider } from '../../src/context/AuthContext'

function Layout({ children }) {
  return (
    <AuthProvider>
      <div>
        {children}
      </div>
    </AuthProvider>
  )
}