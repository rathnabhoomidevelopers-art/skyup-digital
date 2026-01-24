import BlogsContainer from "../components/BlogsContainer";
import { Helmet } from "react-helmet-async";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MotionLink = motion(Link);

const smoothSpring = { type: "spring", stiffness: 80, damping: 18, mass: 0.9 };
const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: smoothSpring },
};

const staggerWrap = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

export function Blogs() {
  return (
    <div className="font-poppins">
      <Helmet>
        <title>
          Digital Marketing vs Traditional Marketing: What You Should Know
        </title>
        <meta
          name="description"
          content="Discover the difference between digital marketing and traditional marketing to enhance strategies and drive better business results."
        />
        <meta
          name="keywords"
          content="Difference between digital marketing and traditional marketing"
        />
        <link
          rel="canonical"
          href="https://www.skyupdigitalsolutions.com/blogs"
        />
      </Helmet>
      <Header />
      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerWrap}
        style={{
          backgroundImage: "url('/images/blogpage_banner.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="h-[221px] sm:h-[400px] flex flex-col items-center bg-[#EEF1FC] justify-center"
      >
        <div className="text-blue-600 font-semibold text-[18px]">Blogs Hub</div>
        <motion.h1
          variants={fadeUp}
          className="text-center mt-2 lg:text-[64px] sm:text-[32px] text-[24px] fw-bold"
        >
          Digital Growth <span className="text-[#0037CA]">Insights</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-center text-[12px] px-3 sm:text-[18px] mt-2 lg:text-[18px]"
        >
          Clear guidance, practical tips, and market updates—with added
          strategies for the Bangalore region.
        </motion.p>
      </motion.div>
      <BlogsContainer />
      <div className="bg-[#FFF8F0] mt-6 py-1">
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="
                          mx-auto
                          m-[60px]
                          sm:m-[70px]
                          text-center
                          font-poppins
                          px-3
                          sm:max-w-[800px]
                        "
        >
          <h2 className="text-[#0037CA] font-bold text-[24px] sm:text-[64px] leading-tight">
            Ready to Grow Faster?
          </h2>

          <p className="mt-3 text-[#2B2B2B] text-[16px] sm:text-[20px] leading-relaxed">
            Serving companies of every scale. Connect with us to start the
            conversation.
          </p>

          <div className="mt-8 flex justify-center">
            <MotionLink
              to="/contactus"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="
                              bg-[#0037CA] text-white
                              font-semibold text-sm sm:text-base
                              px-6 py-2.5
                              rounded-full
                              shadow-[0_10px_24px_rgba(0,0,0,0.18)]
                              hover:scale-[1.03] active:scale-[0.99]
                              transition-transform
                              inline-flex items-center justify-center
                              no-underline
                            "
            >
              GET STARTED
            </MotionLink>
          </div>
        </motion.section>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.9 }}
        className="fixed bottom-5 right-4 z-[9999] flex flex-col items-end gap-4 font-poppins"
      >
        <a
          href="https://wa.me/918867867775"
          target="_blank"
          rel="noopener noreferrer"
          className=" whatsapp-chat
            sm:hidden
            w-12 h-12
            rounded-xl
            bg-[#25D366]
            flex items-center justify-center
            shadow-[0_12px_30px_rgba(0,0,0,0.25)]
          "
        >
          <img
            src="/images/whatsapp.svg"
            alt="whatsapp"
            className="w-7 h-7 text-white"
          />
        </a>

        <a
          href="https://wa.me/918867867775"
          target="_blank"
          rel="noopener noreferrer"
          className=" whatsapp-chat-gtm
            hidden sm:inline-flex
            group no-underline relative items-center
            bg-white
            pl-3 pr-[70px] py-3
            rounded-xl
            shadow-[0_12px_35px_rgba(0,0,0,0.18)]
            hover:scale-[1.02] transition-transform
          "
        >
          <span className="text-slate-800 group-hover:text-green-600 font-semibold text-base whitespace-nowrap transition-colors">
            WhatsApp
          </span>

          <span
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              w-11 h-11 rounded-xl
              bg-[#25D366]
              flex items-center justify-center
              shadow-[0_6px_16px_rgba(0,0,0,0.12)]
            "
          >
            <img
              src="/images/whatsapp.svg"
              alt="whatsapp"
              className="w-7 h-7 text-white"
            />
          </span>
        </a>

        <a
          href="tel:+918867867775"
          className=" tel-chat
            sm:hidden
            w-12 h-12
            rounded-xl
            bg-[#3B46F6]
            flex items-center justify-center
            shadow-[0_12px_30px_rgba(0,0,0,0.25)]
          "
        >
          <img
            src="/images/call.svg"
            alt="call"
            className="w-7 h-7 text-white"
          />
        </a>

        <a
          href="tel:+918867867775"
          className=" tel-chat-gtm
            hidden sm:inline-flex
            group no-underline relative items-center
            bg-white
            pl-3 pr-[66px] py-3
            rounded-xl
            shadow-[0_12px_35px_rgba(0,0,0,0.18)]
            hover:scale-[1.02] transition-transform
          "
        >
          <span className="text-slate-800 group-hover:text-[#3B46F6] font-semibold text-base whitespace-nowrap transition-colors">
            +91 8867867775
          </span>

          <span
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              w-11 h-11 rounded-xl
              bg-[#3B46F6]
              flex items-center justify-center
              shadow-[0_6px_16px_rgba(0,0,0,0.12)]
            "
          >
            <img
              src="/images/call.svg"
              alt="call"
              className="w-7 h-7 text-white"
            />
          </span>
        </a>
      </motion.div>
      <Footer />
    </div>
  );
}
