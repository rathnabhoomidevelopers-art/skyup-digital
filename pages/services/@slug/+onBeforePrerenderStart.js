// pages/services/@slug/+onBeforePrerenderStart.js
import { SERVICES } from '../../../src/data/servicesData'

export default function onBeforePrerenderStart() {
  return Object.keys(SERVICES).map((slug) => `/services/${slug}`)
}