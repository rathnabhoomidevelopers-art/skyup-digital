import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/aboutus", label: "About Us" },
    { to: "/service", label: "Services" },
    { to: "/blogs", label: "Blogs" },
    { to: "/careers", label: "Careers" },
  ];

  // Social media with brand colors
  const socialLinks = [
    { 
      Icon: "/images/FB.svg", 
      href: "https://www.facebook.com/profile.php?id=61584820941998",
      bg: "bg-blue-400",
      hoverBg: "hover:bg-blue-800",
      text: "text-white"
    },
    { 
      Icon: "/images/Insta.svg", 
      href: "https://www.instagram.com/skyupdigitalsolutions/",
      bg: "bg-gradient-to-r from-pink-400 to-purple-400",
      hoverBg: "hover:from-pink-600 hover:to-purple-600",
      text: "text-white"
    },
    { 
      Icon: "/images/Twitter.svg", 
      href: "https://www.linkedin.com/company/110886969/admin/",
      bg: "bg-blue-400",
      hoverBg: "hover:bg-blue-800",
      text: "text-white"
    },
    { 
      Icon: "/images/YT.svg", 
      href: "https://www.youtube.com/@SKYUPDigitalSolutionsBengaluru",
      bg: "bg-red-400",
      hoverBg: "hover:bg-red-700",
      text: "text-white"
    },
  ];

  // Active link based on current route
  const getIsActive = (to) => {
    if (to === "#") return false;
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  const toggleMobileMenu = () => setMobileOpen((prev) => !prev);

  // Close mobile menu on route change (extra safety)
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
  if (mobileOpen) document.body.style.overflow = "hidden";
  else document.body.style.overflow = "";
  return () => (document.body.style.overflow = "");
}, [mobileOpen]);


  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 18, mass: 0.7 }}
        className="sticky top-0 left-0 w-full h-20 font-poppins bg-[#F9ECDE] z-50"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between gap-3">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 !no-underline">
              <img
                src="/images/rbd-logo.webp"
                alt="RBD Logo"
                className="h-10 w-auto sm:h-12 md:h-10 lg:h-12"
              />
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex flex-1 justify-center">
              <div
                className="
                  inline-flex items-center bg-white rounded-full shadow-sm
                  px-3 py-2 lg:px-4
                  gap-4 lg:gap-8
                "
              >
                {links.map((l) => {
                  const isActive = getIsActive(l.to);

                  const baseClasses = [
                    "inline-flex items-center justify-center",
                    "px-3 py-2 lg:px-4",
                    "rounded-full",
                    "font-semibold whitespace-nowrap",
                    "text-[14px] lg:text-sm",
                    "transition-all duration-200",
                  ].join(" ");

                  if (l.to === "#") {
                    return (
                      <button
                        key={l.label}
                        type="button"
                        className={[
                          baseClasses,
                          isActive
                            ? "border border-blue-600 text-[#1F6BFF] shadow-[0_0_0_1px_rgba(31,107,255,0.15)] bg-white"
                            : "text-[#2B2B2B] hover:text-[#1F6BFF]"
                        ].join(" ")}
                      >
                        {l.label}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={l.label}
                      to={l.to}
                      className={[
                        baseClasses,
                        "!no-underline",
                        isActive
                          ? "border border-[#1F6BFF] text-[#1F6BFF] shadow-[0_0_0_1px_rgba(31,107,255,0.15)] bg-white"
                          : "text-[#2B2B2B] hover:text-[#1F6BFF]"
                      ].join(" ")}
                    >
                      {l.label}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2">
                {socialLinks.map(({ Icon, href, bg, hoverBg, text }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`h-9 w-9 rounded-full ${bg} flex items-center justify-center ${text} hover:scale-110 transition-all duration-200 !no-underline ${hoverBg}`}
                  >
                    <img src={Icon} alt="icon" />
                  </a>
                ))}
              </div>

              {/* CTA */}
              <Link
                to="/contactus"
                className="
                  hidden md:inline-flex items-center justify-center rounded-full bg-[#0037CA]
                  px-3 py-2 text-[13px]
                  lg:px-4 lg:py-2.5 lg:text-base
                  font-semibold text-white shadow-sm hover:bg-[#0452da]
                  transition-colors whitespace-nowrap !no-underline
                "
              >
                Contact US
              </Link>

              {/* Mobile menu button */}
              <button
                type="button"
                className="inline-flex md:hidden items-center justify-center p-2 rounded-full bg-[#0052E0] text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0052E0]"
                onClick={toggleMobileMenu}
                aria-label="Toggle main menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
  {mobileOpen && (
    <motion.div
      key="mobile-menu"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="md:hidden fixed left-0 right-0 top-20 bg-[#F9ECDE] z-[9999] shadow-lg"
    >
      <nav className="flex flex-col px-4 pb-4 pt-3 space-y-2">
        {links.map((l) => {
          const isActive = getIsActive(l.to);

          if (l.to === "#") {
            return (
              <button
                key={l.label}
                type="button"
                onClick={() => setMobileOpen(false)}
                className={[
                  "w-full text-left text-sm font-medium px-3 py-2 rounded-md",
                  isActive ? "bg-white text-[#1F6BFF]" : "text-gray-900 hover:bg-white/60",
                ].join(" ")}
              >
                {l.label}
              </button>
            );
          }

          return (
            <Link
              key={l.label}
              to={l.to}
              onClick={() => setMobileOpen(false)}
              className={[
                "w-full text-left text-sm font-medium px-3 py-2 rounded-md !no-underline",
                isActive ? "bg-white text-[#1F6BFF]" : "text-gray-900 hover:bg-white/60",
              ].join(" ")}
            >
              {l.label}
            </Link>
          );
        })}

        <div className="flex items-center gap-3 pt-2">
          {socialLinks.map(({ Icon, href, bg, hoverBg, text }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`h-9 w-9 rounded-full ${bg} flex items-center justify-center ${text} hover:scale-110 transition-all duration-200 !no-underline ${hoverBg}`}
            >
              <img src={Icon} alt="icon" />
            </a>
          ))}
        </div>

        <Link
          to="/contactus"
          onClick={() => setMobileOpen(false)}
          className="mt-3 inline-flex items-center justify-center rounded-full bg-[#0052E0] px-5 py-2 text-sm font-semibold text-white shadow-sm !no-underline"
        >
          Contact US
        </Link>
      </nav>
    </motion.div>
  )}
</AnimatePresence>

    </>
  );
}
