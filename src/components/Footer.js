import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  const services = [
    { label: "Digital Marketing", to: "/service?category=Digital%20Marketing" },
    { label: "Branding & Design", to: "/service?category=Design%20%26%20Branding" },
    { label: "Web Development", to: "/service?category=Web%20Development" },
    { label: "Lead Automation", to: "/service?category=AI-Automation" },
    { label: "UI UX", to: "/services/ui-ux-design" },
  ];

  const resources = [
    { label: "About Us", to: "/aboutus" },
    { label: "Services", to: "/service" },
    { label: "Blogs", to: "/blogs" },
    { label: "Careers", to: "/careers" },
    { label: "Privacy Policy", to: "/privacypolicy" },
    { label: "Terms & Conditions", to: "/termscondition" },
  ];

  const socialLinks = [
    { Icon: Facebook, href: "https://www.facebook.com/profile.php?id=61584820941998", label: "Facebook" },
    { Icon: Instagram, href: "https://www.instagram.com/skyupdigitalsolutions/", label: "Instagram" },
    { Icon: Linkedin, href: "https://www.linkedin.com/company/110886969/admin/", label: "LinkedIn" },
    { Icon: Youtube, href: "https://www.youtube.com/@SKYUPDigitalSolutionsBengaluru", label: "YouTube" },
  ];

  return (
    <footer className="w-full bg-gradient-to-b from-[#00164F] to-[#0032B5] text-white font-poppins">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-8">

        {/* ================= MOBILE ================= */}
        <div className="sm:hidden">
          <img
            src="/images/SKYUP_Logo_white.webp"
            alt="SkyUp Digital Solutions"
            className="w-[170px] h-auto"
          />

          <p className="mt-4 text-white/80 leading-relaxed max-w-sm">
            <strong className="text-lg">SkyUp Digital Solutions LLP</strong> empowers brands with
            result-oriented digital marketing, creative branding, and smart automation turning
            visibility into real business growth.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-10">
            {/* Services */}
            <div>
              <h3 className="text-xl font-semibold">Services</h3>
              <ul className="mt-4 space-y-2 list-none p-0 m-0">
                {services.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-[16px] text-white/80 hover:text-white no-underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold">Quick Links</h3>
              <ul className="mt-4 space-y-2 list-none p-0 m-0">
                {resources.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-[16px] text-white/80 hover:text-white no-underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-6">
            <h3 className="text-2xl font-semibold">Contact Us</h3>
            <div className="mt-3 space-y-2 text-white/85">
            <a href="https://share.google/mOS54S7HnQWJEGTsg" target="_blank" className="text-white/85 no-underline">Sahakar Nagar, Byatarayanapura, Bengaluru, Karnataka</a>
              <div>
                Email:{" "}
                <a
                  href="mailto:info@skyupdigitalsolutions.com"
                  className="text-white/85 no-underline"
                >
                  info@skyupdigitalsolutions.com
                </a>
              </div>
              <div>
                Phone:{" "}
                <a
                  href="tel:+918867867775"
                  className="text-white/85 no-underline"
                >
                  +91 8867867775
                </a>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-6">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5 text-white hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-white/35" />
          <div className="pt-4 text-left text-[12px] text-white/85">
            © 2025 Sky Up Digital Solutions LLP. All Rights Reserved.
          </div>
        </div>

        {/* ================= DESKTOP ================= */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_0.9fr_1.1fr] gap-y-10 gap-x-14">
          <div>
            <img
              src="/images/SKYUP_Logo_white.webp"
              alt="SkyUp Digital Solutions"
              className="w-[170px] h-auto mt-2"
            />
            <p className="mt-4 text-white/80 leading-relaxed max-w-sm">
              <strong className="text-lg">SKYUP Digital Solutions LLP</strong> empowers brands with
              result-oriented digital marketing, creative branding, and smart automation turning
              visibility into real business growth.
            </p>
          </div>

          {/* Services */}
          <div className="pt-[6px]">
            <h3 className="text-xl font-semibold">Services</h3>
            <ul className="mt-4 space-y-2 list-none p-0 m-0">
              {services.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-[18px] text-white/80 hover:text-white no-underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="pt-[6px]">
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2 list-none p-0 m-0">
              {resources.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-[18px] text-white/80 hover:text-white no-underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="pt-[6px]">
            <h3 className="text-2xl font-semibold">Contact Us</h3>
            <div className="mt-3 space-y-2 text-white/85">
            <a href="https://share.google/mOS54S7HnQWJEGTsg" target="_blank" className="text-white/85 no-underline">Sahakar Nagar, Byatarayanapura, Bengaluru, Karnataka</a>
              <div className="flex">
                Email:&nbsp;{" "}
                <a
                  href="mailto:contact@skyupdigitalsolutions.com"
                  className="text-white/85 no-underline"
                >
                  contact@skyupdigitalsolutions.com
                </a>
              </div>
              <div>
                Phone:{" "}
                <a
                  href="tel:+918867867775"
                  className="text-white/85 no-underline"
                >
                  +91 8867867775
                </a>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5 text-white hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden sm:block mt-8 border-t border-white/35" />
        <div className="hidden sm:block mt-2 py-3 text-center text-white/85">
          © 2025 SKYUP Digital Solutions LLP. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
