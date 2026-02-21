// pages/+config.js
import vikeReact from 'vike-react/config'

export default {
  extends: vikeReact,
  prerender: true,
  clientRouting: true,
  passToClient: ['urlPathname'],

  meta: {
    // ❌ Remove description — declaring it here makes Vike render it natively
    // which duplicates what +Head.jsx already renders
    keywords: {
      env: { server: true, client: true }
    }
  }
}