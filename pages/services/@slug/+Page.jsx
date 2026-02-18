import React from 'react'
import { Head } from 'vike-react/Head'
import { usePageContext } from 'vike-react/usePageContext'
import { SERVICES, DEFAULT_SERVICE_SLUG } from '../../../src/data/servicesData'
import SubServicePage from '../../../src/pages/SubServicePage'

export default function Page() {
  const pageContext = usePageContext()
  const slug = pageContext.routeParams?.slug

  // Mirror the same logic used inside SubServicePage
  const data = SERVICES[slug] || SERVICES[DEFAULT_SERVICE_SLUG]

  const canonicalUrl = `https://www.skyupdigitalsolutions.com/services/${slug}`

  return (
    <>
      <Head>
        <title>{data?.title || 'Digital Marketing Services | SkyUp'}</title>
        <meta name="description" content={data?.description || ''} />
        <meta name="keywords" content={data?.keyword || ''} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        {/* Dynamic FAQ Schema — only injected if data has it */}
        {data?.faqSchema && (
          <script type="application/ld+json">
            {JSON.stringify(data.faqSchema)}
          </script>
        )}
      </Head>
      <SubServicePage vikeSlug={slug} />
    </>
  )
}