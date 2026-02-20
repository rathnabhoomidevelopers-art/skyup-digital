// pages/blog/@slug/+onBeforePrerenderStart.js
import { BLOGS } from '../../../src/data/blogs'

export default function onBeforePrerenderStart() {
  return BLOGS.map((blog) => `/blog/${blog.slug}`)
}