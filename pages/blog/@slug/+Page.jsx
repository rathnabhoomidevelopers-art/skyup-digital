import React from 'react'
import { Head } from 'vike-react/Head'
import { usePageContext } from 'vike-react/usePageContext'
import BlogDetail from '../../../src/pages/BlogDetail'
import { BLOGS } from '../../../src/data/blogs'

export default function Page() {
  const pageContext = usePageContext()
  const slug = pageContext.routeParams?.slug
  const blog = BLOGS.find(b => b.slug === slug)

  return (
    <>
      <Head>
        <title>{blog?.title || 'Blog | SkyUp Digital'}</title>
        <meta name="description" content={blog?.description || ''} />
        <link rel="canonical" href={`https://www.skyupdigitalsolutions.com/blog/${slug}`} />
      </Head>
      <BlogDetail vikeSlug={slug} />
    </>
  )
}