import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'

export default function Layout({ children, pageContext }) {
  const isServer = typeof window === 'undefined'

  return (
    <HelmetProvider>
      {isServer ? (
        <MemoryRouter initialEntries={[pageContext?.urlPathname || '/']}>
          {children}
        </MemoryRouter>
      ) : (
        <BrowserRouter>
          {children}
        </BrowserRouter>
      )}
    </HelmetProvider>
  )
}