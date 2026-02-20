// pages/services/@slug/+Head.jsx
import { usePageContext } from 'vike-react/usePageContext'
import { SERVICES, DEFAULT_SERVICE_SLUG } from '../../../src/data/servicesData'

export default function Head() {
  const pageContext = usePageContext()
  const slug = pageContext.routeParams?.slug
  const data = SERVICES[slug] || SERVICES[DEFAULT_SERVICE_SLUG]
  const canonicalUrl = `https://www.skyupdigitalsolutions.com/services/${slug}`

  return (
    <>
      <title>{data?.title || 'Digital Marketing Services | SkyUp'}</title>
      <meta name="description" content={data?.description || ''} />
      <meta name="keywords" content={data?.keyword || ''} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />
      {data?.faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(data.faqSchema)}
        </script>
      )}
    </>
  )
}