import vikeReact from 'vike-react/config'

export default {
  extends: vikeReact,
  prerender: true,
  clientRouting: true,
  passToClient: ['title', 'description', 'keywords']
}