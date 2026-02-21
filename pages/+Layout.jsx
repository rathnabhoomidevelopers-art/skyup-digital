// pages/+Layout.jsx
import { usePageContext } from 'vike-react/usePageContext'
import { useEffect } from 'react'
import { SERVICES, DEFAULT_SERVICE_SLUG } from '../src/data/servicesData'
import { BLOGS } from '../src/data/blogs'

export default function Layout({ children }) {
  const pageContext = usePageContext()
  const { config, urlPathname } = pageContext

  useEffect(() => {
    let title = config?.title
    let description = config?.description
    let keywords = config?.keywords

    // ── Service slug pages ────────────────────────────────────
    const serviceMatch = urlPathname.match(/^\/services\/(.+)$/)
    if (serviceMatch) {
      const slug = serviceMatch[1]
      const data = SERVICES[slug] || SERVICES[DEFAULT_SERVICE_SLUG]
      title = data?.title
      description = data?.description
      keywords = data?.keyword
    }

    // ── Blog slug pages ───────────────────────────────────────
    const blogMatch = urlPathname.match(/^\/blog\/(.+)$/)
    if (blogMatch) {
      const slug = blogMatch[1]
      const blog = BLOGS.find((b) => b.slug === slug)
      title = blog?.title
      description = blog?.description
      keywords = blog?.Keywords
    }

    // ── Apply title ───────────────────────────────────────────
    if (title) document.title = title

    // ── Apply description ─────────────────────────────────────
    let descTag = document.querySelector('meta[name="description"]')
    if (!descTag) {
      descTag = document.createElement('meta')
      descTag.setAttribute('name', 'description')
      document.head.appendChild(descTag)
    }
    descTag.setAttribute('content', description ?? '')

    // ── Apply keywords ────────────────────────────────────────
    let kwTag = document.querySelector('meta[name="keywords"]')
    if (!kwTag) {
      kwTag = document.createElement('meta')
      kwTag.setAttribute('name', 'keywords')
      document.head.appendChild(kwTag)
    }
    kwTag.setAttribute('content', keywords ?? '')

    // ── Canonical ─────────────────────────────────────────────
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute(
      'href',
      `https://www.skyupdigitalsolutions.com${urlPathname === '/' ? '' : urlPathname}`
    )

  }, [urlPathname])

  return <>{children}</>
}