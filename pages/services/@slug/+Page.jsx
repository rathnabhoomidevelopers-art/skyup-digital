// pages/services/@slug/+Page.jsx
import { usePageContext } from 'vike-react/usePageContext'
import SubServicePage from '../../../src/pages/SubServicePage'

export default function Page() {
  const pageContext = usePageContext()
  const slug = pageContext.routeParams?.slug

  return <SubServicePage vikeSlug={slug} />
}