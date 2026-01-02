import Footer from "../components/Footer";
import Header from "../components/Header";
import { motion } from "framer-motion";
import ContactCTAContainer from "../components/ContactCTAContainer";

const smoothSpring = { type: "spring", stiffness: 80, damping: 18, mass: 0.9 };
const staggerWrap = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: smoothSpring },
};

export default function PrivacyPolicy() {
  return (
    <div className="font-poppins">
      <Header />

      {/* Hero */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerWrap}
        className="
          min-h-[200px] sm:min-h-[266px]
          flex flex-col items-center justify-center
          bg-gradient-to-b from-[#00164F] to-[#0032B5]
          px-4
        "
      >
        <motion.h1
          variants={fadeUp}
          className="
            text-center text-white font-bold
            text-[22px] sm:text-[32px] lg:text-[64px]
            max-w-[900px]
            leading-snug
          "
        >
          Privacy Policy
        </motion.h1>
      </motion.div>

      {/* Content */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerWrap}
        className="px-4 py-10 sm:p-20 lg:p-20"
      >
        <div className="mx-auto max-w-5xl text-[#111827]">
          {/* Introduction */}
          <h2 className="font-bold text-[18px] sm:text-[24px]">Introduction</h2>
          <p className="mt-3 text-[14px] sm:text-[16px] leading-relaxed text-[#374151]">
            This Privacy Policy outlines how SKYUP Digital Solutions ("we", "our", "us")
            collects, uses, discloses, and protects personal information obtained from users
            ("you", "your") who visit our website or engage with our digital marketing services.
            We are committed to safeguarding your privacy and ensuring transparency in how your
            information is handled.
          </p>
          <p className="mt-3 text-[14px] sm:text-[16px] leading-relaxed text-[#374151]">
            By accessing our website or using our services, you agree to the terms of this Privacy Policy.
          </p>

          {/* Information We Collect */}
          <h2 className="mt-8 font-bold text-[18px] sm:text-[24px]">Information We Collect</h2>
          <p className="mt-3 text-[14px] sm:text-[16px] text-[#374151]">
            We may collect the following types of information:
          </p>

          <h3 className="mt-4 font-bold text-[16px] sm:text-[18px] text-[#111827]">
            1. Personal Information
          </h3>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-[14px] sm:text-[16px] text-[#374151]">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Company name</li>
            <li>Job title</li>
            <li>Any information submitted through contact forms, lead forms, or inquiries</li>
          </ul>

          <h3 className="mt-6 font-bold text-[16px] sm:text-[18px] text-[#111827]">
            2. Non-Personal Information
          </h3>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-[14px] sm:text-[16px] text-[#374151]">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Pages visited and time spent on the website</li>
            <li>Referring URLs</li>
          </ul>

          <h3 className="mt-6 font-bold text-[16px] sm:text-[18px] text-[#111827]">
            3. Marketing and Advertising Data
          </h3>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-[14px] sm:text-[16px] text-[#374151]">
            <li>
              Lead data collected via platforms such as Google Ads, Meta (Facebook/Instagram),
              LinkedIn Ads, or other advertising channels
            </li>
            <li>
              Campaign interaction data, including form submissions and engagement metrics
            </li>
          </ul>

          {/* How We Use */}
          <h2 className="mt-8 font-bold text-[18px] sm:text-[24px]">How We Use Your Information</h2>
          <p className="mt-3 text-[14px] sm:text-[16px] text-[#374151]">
            We use the collected information for the following purposes:
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-[14px] sm:text-[16px] text-[#374151]">
            <li>To respond to inquiries and provide requested services</li>
            <li>To deliver digital marketing, advertising, and consulting services</li>
            <li>To improve website performance, user experience, and service quality</li>
            <li>To manage leads, campaigns, and client communication</li>
            <li>
              To send service-related updates, proposals, or marketing communications (only where permitted)
            </li>
            <li>To comply with legal and regulatory requirements</li>
          </ul>

          {/* Cookies */}
          <h2 className="mt-8 font-bold text-[18px] sm:text-[24px]">
            Cookies and Tracking Technologies
          </h2>
          <p className="mt-3 text-[14px] sm:text-[16px] leading-relaxed text-[#374151]">
            Our website may use cookies, pixels, and similar tracking technologies to:
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-[14px] sm:text-[16px] text-[#374151]">
            <li>Analyze website traffic and user behavior</li>
            <li>Measure advertising performance</li>
            <li>Improve targeting and remarketing efforts</li>
          </ul>
          <p className="mt-3 text-[14px] sm:text-[16px] leading-relaxed text-[#374151]">
            You may control or disable cookies through your browser settings. Disabling cookies may
            affect certain website functionalities.
          </p>

          {/* Sharing */}
          <h2 className="mt-8 font-bold text-[18px] sm:text-[24px]">Data Sharing and Disclosure</h2>
          <p className="mt-3 text-[14px] sm:text-[16px] leading-relaxed text-[#374151]">
            We do not sell or rent your personal information. We may share information only in the
            following circumstances:
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-[14px] sm:text-[16px] text-[#374151]">
            <li>
              With trusted service providers and partners who assist in delivering our services
              (e.g., hosting providers, CRM tools, analytics platforms)
            </li>
            <li>With advertising platforms for campaign execution and performance measurement</li>
            <li>When required by law, legal process, or governmental request</li>
            <li>To protect our rights, property, or safety</li>
          </ul>
          <p className="mt-3 text-[14px] sm:text-[16px] leading-relaxed text-[#374151]">
            All third parties are required to maintain the confidentiality and security of your data.
          </p>

          {/* Security */}
          <h2 className="mt-8 font-bold text-[18px] sm:text-[24px]">Data Security</h2>
          <p className="mt-3 text-[14px] sm:text-[16px] leading-relaxed text-[#374151]">
            We implement appropriate technical and organizational security measures to protect your
            personal information against unauthorized access, alteration, disclosure, or destruction.
            However, no method of data transmission over the internet is 100% secure.
          </p>

          {/* Retention */}
          <h2 className="mt-8 font-bold text-[18px] sm:text-[24px]">Data Retention</h2>
          <p className="mt-3 text-[14px] sm:text-[16px] leading-relaxed text-[#374151]">
            We retain personal information only for as long as necessary to fulfill the purposes
            outlined in this policy, comply with legal obligations, resolve disputes, and enforce agreements.
          </p>

          {/* Links */}
          <h2 className="mt-8 font-bold text-[18px] sm:text-[24px]">Third-Party Links</h2>
          <p className="mt-3 text-[14px] sm:text-[16px] leading-relaxed text-[#374151]">
            Our website may contain links to third-party websites. We are not responsible for the privacy
            practices or content of those external sites. We encourage you to review their privacy policies.
          </p>

          {/* Rights */}
          <h2 className="mt-8 font-bold text-[18px] sm:text-[24px]">Your Rights</h2>
          <p className="mt-3 text-[14px] sm:text-[16px] text-[#374151]">
            Depending on applicable laws, you may have the right to:
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-[14px] sm:text-[16px] text-[#374151]">
            <li>Access the personal data we hold about you</li>
            <li>Request correction or deletion of your data</li>
            <li>Withdraw consent for marketing communications</li>
            <li>Request restriction or objection to data processing</li>
          </ul>
          <p className="mt-3 text-[14px] sm:text-[16px] leading-relaxed text-[#374151]">
            To exercise these rights, please contact us using the details below.
          </p>

          {/* Children */}
          <h2 className="mt-8 font-bold text-[18px] sm:text-[24px]">Children’s Privacy</h2>
          <p className="mt-3 text-[14px] sm:text-[16px] leading-relaxed text-[#374151]">
            Our services are not intended for individuals under the age of 18. We do not knowingly
            collect personal information from children.
          </p>

          {/* Changes */}
          <h2 className="mt-8 font-bold text-[18px] sm:text-[24px]">Changes to This Privacy Policy</h2>
          <p className="mt-3 text-[14px] sm:text-[16px] leading-relaxed text-[#374151]">
            We may update this Privacy Policy from time to time. Any changes will be posted on this
            page with an updated effective date. Continued use of our website or services constitutes
            acceptance of the revised policy.
          </p>

         
        </div>
      </motion.div>

      {/* CTA (same style as Terms page) */}
      <div className="-mt-6 sm:-mt-12 lg:-mt-20">
        <ContactCTAContainer
          title="Contact Information"
          subtitle="For any questions regarding this Privacy Policy or our data practices, please contact us:"
        />
      </div>

      <Footer />
    </div>
  );
}
