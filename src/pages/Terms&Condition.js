import Footer from "../components/Footer";
import Header from "../components/Header";
import { motion } from "framer-motion";
import ContactCTAContainer from "../components/ContactCTAContainer";

const smoothSpring = { type: "spring", stiffness: 80, damping: 18, mass: 0.9 };
const staggerWrap = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};
const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: smoothSpring },
};

export default function TermsCondition() {
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
          Terms & Conditions
        </motion.h1>
      </motion.div>

      {/* Content */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerWrap}
        className="px-4 py-10 sm:px-6 lg:px-10"
      >
        <div className="mx-auto max-w-5xl">
          {/* Common text styles */}
          <div className="text-[#111827]">
            <h2 className="font-bold text-[18px] sm:text-[24px]">Introduction</h2>
            <p className="mt-3 text-[14px] sm:text-[18px] leading-relaxed text-[#374151]">
              Welcome to SKYUP Digital Solutions. By accessing our website, engaging with our services,
              or entering into a business relationship with us, you agree to comply with and be bound
              by the following Terms & Conditions and Refund Policy. Please read this page carefully
              before using our services.
            </p>

            <h2 className="mt-8 font-bold text-[18px] sm:text-[24px]">Use of Website</h2>
            <ul className="mt-3 list-disc pl-5 space-y-2 text-[14px] sm:text-[16px] text-[#374151]">
              <li>The content on this website is for general information purposes only.</li>
              <li>You agree not to misuse the website or attempt unauthorized access to systems or data.</li>
              <li>We reserve the right to update or modify website content at any time without prior notice.</li>
            </ul>

            <h2 className="mt-8 font-bold text-[18px] sm:text-[24px]">Client Responsibilities</h2>
            <p className="mt-3 text-[14px] sm:text-[16px] text-[#374151]">Clients agree to:</p>
            <ul className="mt-3 list-disc pl-5 space-y-2 text-[14px] sm:text-[16px] text-[#374151]">
              <li>Provide accurate, complete, and timely information required for project execution</li>
              <li>Approve creatives, campaigns, and content within reasonable timelines</li>
              <li>Ensure that all materials provided (logos, images, data) do not violate third-party rights</li>
            </ul>
            <p className="mt-3 text-[14px] sm:text-[16px] text-[#374151]">
              Delays caused by incomplete information or approvals may impact timelines and outcomes.
            </p>

            <h2 className="mt-8 font-bold text-[18px] sm:text-[24px]">Payments and Pricing</h2>
            <ul className="mt-3 list-disc pl-5 space-y-2 text-[14px] sm:text-[16px] text-[#374151]">
              <li>All prices are quoted in Indian Rupees (INR) unless stated otherwise.</li>
              <li>Payments must be made as per the agreed payment schedule (advance, milestone, or monthly retainers).</li>
              <li>Delayed payments may result in suspension of services.</li>
            </ul>

            <h2 className="mt-8 font-bold text-[18px] sm:text-[24px]">Advertising Spend</h2>
            <ul className="mt-3 list-disc pl-5 space-y-2 text-[14px] sm:text-[16px] text-[#374151]">
              <li>Advertising budgets paid to platforms such as Google, Meta, or LinkedIn are separate from service fees.</li>
              <li>SKYUP Digital Solutions is not responsible for platform policy changes, account suspensions, or fluctuations in performance.</li>
              <li>Results may vary based on market conditions, competition, and platform algorithms.</li>
            </ul>

            <h2 className="mt-8 font-bold text-[18px] sm:text-[24px]">Intellectual Property</h2>
            <ul className="mt-3 list-disc pl-5 space-y-2 text-[14px] sm:text-[16px] text-[#374151]">
              <li>All strategies, creatives, reports, and content created by SKYUP Digital Solutions remain our intellectual property until full payment is received.</li>
              <li>Upon full payment, final deliverables may be used by the client for agreed business purposes.</li>
              <li>Unauthorized reproduction or resale is prohibited.</li>
            </ul>

            <h2 className="mt-8 font-bold text-[18px] sm:text-[24px]">Limitation of Liability</h2>
            <p className="mt-3 text-[14px] sm:text-[16px] text-[#374151]">
              SKYUP Digital Solutions shall not be liable for:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-2 text-[14px] sm:text-[16px] text-[#374151]">
              <li>Any indirect, incidental, or consequential damages</li>
              <li>Loss of revenue, data, or business opportunities</li>
              <li>Performance outcomes influenced by external platforms or client-side factors</li>
            </ul>
            <p className="mt-3 text-[14px] sm:text-[16px] text-[#374151]">
              Our liability, if any, shall not exceed the fees paid for the specific service in question.
            </p>

            <h2 className="mt-8 font-bold text-[18px] sm:text-[24px]">Termination of Services</h2>
            <ul className="mt-3 list-disc pl-5 space-y-2 text-[14px] sm:text-[16px] text-[#374151]">
              <li>Either party may terminate services with written notice as per the agreed contract or proposal.</li>
              <li>Fees for services already rendered or in progress are payable and non-refundable.</li>
            </ul>

            <h2 className="mt-8 font-bold text-[18px] sm:text-[24px]">Refund Policy</h2>
            <ul className="mt-3 list-disc pl-5 space-y-2 text-[14px] sm:text-[16px] text-[#374151]">
              <li>Payments made for digital marketing services are non-refundable once the service has commenced.</li>
              <li>
                No refunds will be issued for:
                <ol className="list-decimal pl-5 mt-2 space-y-1">
                  <li>Work already completed or delivered</li>
                  <li>Advertising spend paid to third-party platforms</li>
                  <li>Monthly retainers after the billing cycle has started</li>
                </ol>
              </li>
              <li>In case of duplicate payment or billing errors, eligible refunds will be processed after internal verification.</li>
            </ul>

            <p className="mt-4 text-[14px] sm:text-[16px] text-[#374151]">
              Approved refunds, if any, will be processed within 7–10 business days.
            </p>

            <h2 className="mt-8 font-bold text-[18px] sm:text-[24px]">Governing Law</h2>
            <p className="mt-3 text-[14px] sm:text-[16px] leading-relaxed text-[#374151]">
              These Terms & Conditions and Refund Policy shall be governed by and construed in accordance with the laws of India.
              Any disputes shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.
            </p>

            <h2 className="mt-8 font-bold text-[18px] sm:text-[24px]">Updates to This Page</h2>
            <p className="mt-3 text-[14px] sm:text-[16px] leading-relaxed text-[#374151]">
              SKYUP Digital Solutions reserves the right to update these Terms & Conditions and Refund Policy at any time.
              Continued use of our services constitutes acceptance of the updated terms.
            </p>
          </div>
        </div>
      </motion.div>

      {/* CTA - responsive top spacing */}
      <div className="-mt-6 sm:-mt-12 lg:-mt-20">
        <ContactCTAContainer
          title="Contact Information"
          subtitle="For any questions regarding these Terms & Conditions or Refund Policy, please contact us:"
        />
      </div>
      <Footer />
    </div>
  );
}
