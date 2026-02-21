// pages/+config.js
import vikeReact from 'vike-react/config'

export default {
  extends: vikeReact,
  prerender: true,
  clientRouting: true,
  passToClient: ['urlPathname'],

  meta: {
    keywords: {
      env: { server: true, client: true }
    },
    description: {
      env: { server: true, client: true }
    }
  }
}