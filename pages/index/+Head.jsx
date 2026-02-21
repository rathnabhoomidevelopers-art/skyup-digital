export default function Head() {

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Why should you hire a performance marketing agency for your business?", "acceptedAnswer": { "@type": "Answer", "text": "By hiring a performance marketing agency in Bangalore, your business can focus on measurable results such as leads, sales, and ROI. It differs from traditional marketing in that performance marketing lets you pay only for accomplished actions, be it a click, conversion, or a sale. A professional agency uses data-driven strategies, advanced analytics, and optimized ad campaigns to scale growth efficiently." } },
    { "@type": "Question", "name": "What are the key KPIs of performance marketing services?", "acceptedAnswer": { "@type": "Answer", "text": "The major KPIs of performance marketing services include Cost Per Lead (CPL), Cost Per Acquisition (CPA), Click-Through Rate, Conversion Rate, Return on Ad Spend, and Customer Lifetime Value. These KPIs assist businesses in effectively evaluating the performance of marketing campaigns in relation to the marketing budget." } },
    { "@type": "Question", "name": "How does performance marketing differ from search engine marketing?", "acceptedAnswer": { "@type": "Answer", "text": "Where performance marketing covers a range of paid channels from social ads to display ads, affiliate marketing, and influencer marketing, performance is determined by conversions alone. SEM focuses more on paid search ads including Google Ads, to raise traffic via keywords. Performance marketing is broader in scope with ROI as its key objective, while SEM is solely search-intent focused." } },
    { "@type": "Question", "name": "How do performance marketing agencies measure campaign success?", "acceptedAnswer": { "@type": "Answer", "text": "A performance marketing agency uses real-time tracking tools such as Google Analytics, conversion tracking, heatmaps, and CRMs to measure performance. Success is measured by the response to a campaign, conversion, revenue growth, returns on ad spend, and business impact." } },
    { "@type": "Question", "name": "How does our performance marketing agency differ from other digital marketing agencies?", "acceptedAnswer": { "@type": "Answer", "text": "Our performance marketing company in Bangalore differs from the rest by providing ROI-based marketing strategies, transparent reporting mechanisms, constant optimization of the marketing campaigns, and creating customized marketing campaigns. We differ from other generic marketing agencies by directly linking marketing goals with business objectives." } },
    { "@type": "Question", "name": "What services does a digital marketing agency in Bangalore offer?", "acceptedAnswer": { "@type": "Answer", "text": "A digital marketing agency in Bangalore offers services such as SEO, performance marketing, Google Ads, social media marketing, content marketing, email marketing, website optimization, and conversion rate optimization to help businesses grow online." } },
    { "@type": "Question", "name": "Why is SEO important for digital marketing success?", "acceptedAnswer": { "@type": "Answer", "text": "SEO is important for digital marketing success because it improves website visibility, drives organic traffic, builds brand credibility, and reduces long-term dependency on paid advertising." } },
    { "@type": "Question", "name": "How important is local SEO for Bangalore-based businesses?", "acceptedAnswer": { "@type": "Answer", "text": "Local SEO in Bangalore is crucial for businesses targeting nearby customers. It improves Google Maps visibility, local search rankings, and helps attract location-specific, ready-to-convert customers." } },
    { "@type": "Question", "name": "Is digital marketing better than traditional marketing?", "acceptedAnswer": { "@type": "Answer", "text": "Digital marketing is more cost-effective, measurable, scalable, and targeted compared to traditional marketing, making it a better choice for modern businesses aiming for sustainable growth." } },
    { "@type": "Question", "name": "What tools do digital marketing agencies use?", "acceptedAnswer": { "@type": "Answer", "text": "Digital marketing agencies use tools like Google Analytics, Google Search Console, SEMrush, Ahrefs, Meta Ads Manager, Google Ads, and CRM tools to track, analyze, and optimize campaign performance." } }
  ]
}

  return (
    <>
      <link rel="canonical" href="https://www.skyupdigitalsolutions.com" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
