import React from 'react'
import { Head } from 'vike-react/Head'
import { AboutUS } from '../../src/pages/AboutUS'

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Who is Skyup?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Skyup is a Digital Marketing Agency in Bangalore focused on delivering result-driven SEO services, PPC services, and performance marketing strategies. We help businesses increase online visibility, generate quality leads, and achieve measurable digital growth."
    }
  },{
    "@type": "Question",
    "name": "What makes Skyup different from other digital marketing agencies?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Skyup stands out as a performance-focused digital marketing agency because we prioritize ROI, data-driven strategies, and transparent reporting. Unlike traditional agencies, we align SEO, Google Ads, and online marketing services directly with your business goals."
    }
  },{
    "@type": "Question",
    "name": "What services does Skyup offer?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Skyup offers complete digital marketing services, including SEO services, PPC services, Google Ads management, social media marketing, performance marketing, and website design & development. Our strategies are customized for startups, small businesses, and enterprises."
    }
  },{
    "@type": "Question",
    "name": "What industries does Skyup work with?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Skyup provides digital marketing services in Bangalore for industries such as real estate, healthcare, education, eCommerce, IT companies, startups, and local service businesses. Our marketing approach is tailored to each industry's needs."
    }
  },{
    "@type": "Question",
    "name": "How does Skyup ensure measurable results?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "As a performance marketing agency, Skyup tracks campaign performance using tools like Google Analytics and Search Console. We measure success through organic traffic growth, lead generation, keyword rankings, and conversion rates."
    }
  },{
    "@type": "Question",
    "name": "Does Skyup work with small businesses and startups?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Yes, Skyup offers affordable digital marketing services designed specifically for small businesses and startups. Our scalable strategies ensure consistent online visibility and lead generation within budget."
    }
  },{
    "@type": "Question",
    "name": "What is Skyup's approach to digital marketing?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Skyup follows a structured approach: website audit, keyword research, SEO optimization, paid advertising strategy, continuous monitoring, and performance improvement. Our focus is long-term growth through ethical and sustainable marketing techniques."
    }
  },{
    "@type": "Question",
    "name": "Why should I choose Skyup as my digital marketing partner?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Choosing Skyup Digital Marketing Agency in Bangalore means partnering with a team that values transparency, innovation, and measurable growth. We focus on delivering real business impact, not just rankings or clicks."
    }
  }]
}


export default function Page() {
  return (
    <>
      <Head>
        <title>Top Digital Marketing Company in Bangalore | SKYUP</title>
        <meta name="description" content="SkyUp is a results-driven Digital Marketing Company in Bangalore offering strategic marketing solutions to boost visibility, leads, and growth." />
        <meta name="keywords" content="Digital Marketing Company in Bangalore." />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Head>
      <AboutUS />
    </>
  )
}