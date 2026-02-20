import { BLOGS } from '../../../src/data/blogs'

export default function onBeforePrerenderStart() {
  return BLOGS.map((blog) => ({
    url: `/blog/${blog.slug}`,
    pageContext: {
      title: blog.title,
      description: blog.description,
      keywords: blog.Keywords,
    }
  }))
}