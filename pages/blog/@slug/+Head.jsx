import { usePageContext } from "vike-react/usePageContext";
import { BLOGS } from "../../../src/data/blogs";

export default function Head() {
  const pageContext = usePageContext();
  const slug = pageContext.routeParams?.slug;
  const blog = BLOGS.find((b) => b.slug === slug);

  return (
    <>
      <title>{blog?.title || "Blog | SkyUp Digital"}</title>
      <meta name="description" content={blog?.description || ""} />
      <meta name="keywords" content={blog?.Keywords || ""} />
      {slug && (
        <link
          rel="canonical"
          href={`https://www.skyupdigitalsolutions.com/blog/${slug}`}
        />
      )}
    </>
  );
}