export default function Head() {

const faqSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.skyupdigitalsolutions.com/#organization",
      "name": "Skyup Digital Solutions LLP",
      "url": "https://www.skyupdigitalsolutions.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.skyupdigitalsolutions.com/images/rbd-logo.webp"
      },
      "sameAs": [
        "https://www.instagram.com/skyupdigitalsolutions/?fbclid=IwY2xjawQMs_pleHRuA2FlbQIxMQBicmlkETJHaFhheHprNzM1UGU3dFRrc3J0YwZhcHBfaWQBMAABHq3k8f1m8rCRpZlHt1eUGgB8LOvsbg5Icbd8grvy2jjf_J36Ny_mDwCpznLD_aem_pDwXRU1k6xSHHO8eF5ADMQ",
        "https://www.facebook.com/profile.php?id=61584820941998#",
        "https://www.linkedin.com/company/110886969"
      ]
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://www.skyupdigitalsolutions.com/#localbusiness",
      "name": "Skyup Digital Solutions LLP",
      "image": "https://lh3.googleusercontent.com/p/AF1QipOYcpY85i4d2QSQas3UvTJRSEuRUWknB8xMRNc=s1360-w1360-h1020-rw",
      "url": "https://www.skyupdigitalsolutions.com/",
      "telephone": "+918867867775",
      "description": "Skyup Digital Solutions LLP is a results-driven Digital Marketing Agency in Bangalore offering SEO, Google Ads, Social Media Marketing, Website Development, and Branding services designed to generate measurable ROI and sustainable business growth.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2nd Floor, No 23, 14A, Dasarahalli Main Rd, E Block, Sahakar Nagar, Byatarayanapura",
        "addressLocality": "Bengaluru",
        "addressRegion": "Karnataka",
        "postalCode": "560092",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "13.0637",
        "longitude": "77.5901"
      },
      "areaServed": {
        "@type": "City",
        "name": "Bangalore"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "09:00",
          "closes": "19:00"
        }
      ],
      "hasMap": "https://share.google/M5hnmOMxRsx6SpYpY",
      "makesOffer": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Search Engine Optimization (SEO) Services" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Google Ads / PPC Advertising" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Social Media Marketing" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Website Design & Development" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Branding & Performance Marketing" } }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.skyupdigitalsolutions.com/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Why should you hire a performance marketing agency for your business?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "By hiring a performance marketing agency in Bangalore, your business can focus on measurable results such as leads, sales, and ROI. It differs from traditional marketing in that performance marketing lets you pay only for accomplished actions, be it a click, conversion, or a sale. A professional agency uses data-driven strategies, advanced analytics, and optimized ad campaigns to scale growth efficiently."
          }
        },
        {
          "@type": "Question",
          "name": "What are the key KPIs of performance marketing services?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The major KPIs of performance marketing services include Cost Per Lead (CPL), Cost Per Acquisition (CPA), Click-Through Rate, Conversion Rate, Return on Ad Spend, and Customer Lifetime Value."
          }
        },
        {
          "@type": "Question",
          "name": "How does performance marketing differ from search engine marketing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Performance marketing covers multiple paid channels and focuses on conversions, while SEM primarily focuses on paid search ads like Google Ads to drive traffic through keywords."
          }
        },
        {
          "@type": "Question",
          "name": "How do performance marketing agencies measure campaign success?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Agencies use tools like Google Analytics, conversion tracking, heatmaps, and CRM systems to measure conversions, revenue growth, and return on ad spend."
          }
        },
        {
          "@type": "Question",
          "name": "How does our performance marketing agency differ from other digital marketing agencies?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We provide ROI-focused strategies, transparent reporting, and continuous campaign optimization aligned with business objectives."
          }
        },
        {
          "@type": "Question",
          "name": "What services does a digital marketing agency in Bangalore offer?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Services include SEO, Google Ads, performance marketing, social media marketing, content marketing, website development, and conversion optimization."
          }
        },
        {
          "@type": "Question",
          "name": "Why is SEO important for digital marketing success?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SEO improves website visibility, drives organic traffic, builds brand authority, and reduces reliance on paid advertising."
          }
        },
        {
          "@type": "Question",
          "name": "How important is local SEO for Bangalore-based businesses?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Local SEO improves Google Maps visibility and attracts nearby customers ready to convert."
          }
        },
        {
          "@type": "Question",
          "name": "Is digital marketing better than traditional marketing?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Digital marketing is more measurable, scalable, and cost-effective compared to traditional marketing."
          }
        },
        {
          "@type": "Question",
          "name": "What tools do digital marketing agencies use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Agencies use Google Analytics, Search Console, SEMrush, Ahrefs, Meta Ads Manager, Google Ads, and CRM tools."
          }
        }
      ]
    }
  ]
};

  return (
    <>
      <link rel="canonical" href="https://www.skyupdigitalsolutions.com" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}

