// pages/service/+Head.jsx
export default function Head() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How can Skyup's digital marketing services help my business grow?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our digital marketing services focus on increasing organic traffic, improving search engine rankings, and generating high-converting leads. By combining SEO, performance marketing, and paid advertising strategies, Skyup ensures measurable growth and sustainable online success."
        }
      },
      {
        "@type": "Question",
        "name": "How can I get started?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simply contact us, share your requirements, and our team will guide you through the next steps."
        }
      },
      {
        "@type": "Question",
        "name": "Do you work with startups as well as established businesses?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! We work with both startups and established businesses, tailoring our digital marketing strategies to fit your unique goals and growth stage."
        }
      },
      {
        "@type": "Question",
        "name": "What makes your digital marketing approach different?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our digital marketing approach is data-driven, customized, and results-focused. We combine creativity with analytics to craft strategies that engage your audience, boost conversions, and maximize ROI."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer branding and creative design services?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We offer comprehensive branding and creative design services as part of our digital marketing solutions, helping your business stand out and connect with your audience effectively."
        }
      },
      {
        "@type": "Question",
        "name": "How does AI automation help my business?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AI automation streamlines your marketing efforts by analyzing data, optimizing campaigns, and personalizing customer interactions, helping your business save time, increase efficiency, and drive better results."
        }
      }
    ]
  }

  return (
    <>
      <link rel="canonical" href="https://www.skyupdigitalsolutions.com/service" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}