import { SERVICES } from '../../../src/data/servicesData'

export default function onBeforePrerenderStart() {
  return Object.entries(SERVICES).map(([slug, data]) => ({
    url: `/services/${slug}`,
    pageContext: {
      title: data.title,
      description: data.description,
      keywords: data.keyword
    }
  }))
}