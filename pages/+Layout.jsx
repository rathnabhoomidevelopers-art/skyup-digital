import { usePageContext } from 'vike-react/usePageContext'
import { useEffect } from 'react'

export default function Layout({ children }) {
  const pageContext = usePageContext()

  useEffect(() => {
    // Update canonical
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = `https://www.skyupdigitalsolutions.com${pageContext.urlPathname}`

    // Update description
    let description = document.querySelector('meta[name="description"]')
    if (!description) {
      description = document.createElement('meta')
      description.name = 'description'
      document.head.appendChild(description)
    }
    if (pageContext.config?.description) {
      description.content = pageContext.config.description
    }

    // Update keywords
    let keywords = document.querySelector('meta[name="keywords"]')
    if (!keywords) {
      keywords = document.createElement('meta')
      keywords.name = 'keywords'
      document.head.appendChild(keywords)
    }
    if (pageContext.keywords) {
      keywords.content = pageContext.keywords
    }
  }, [pageContext.urlPathname])

  return <>{children}</>
}