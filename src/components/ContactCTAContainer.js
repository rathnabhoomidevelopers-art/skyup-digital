import {
  PhoneCall,
  MessageSquareText,
  Mail,
  Globe,
} from "lucide-react";

export default function ContactCTAContainer({
  title,
  subtitle,
}) {
  return (
    <section className="w-full bg-transparent font-poppins py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Card */}
        <div className="mx-auto w-full max-w-[900px] rounded-2xl bg-[#2F2F2F] p-6 sm:p-8 lg:p-10 shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
          
          {/* Top content */}
          <div className="max-w-[650px]">
            <h3 className="text-white font-bold text-[18px] sm:text-[24px] lg:text-[26px] leading-snug">
              {title}
            </h3>

            {subtitle && (
              <p className="mt-2 text-white/70 text-[12px] sm:text-[13px] lg:text-[14px] leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Buttons grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ContactTile
              Icon={PhoneCall}
              label="CALL US"
              value="+91 8867867775"
              href="tel:+918867867775"
            />
            <ContactTile
              Icon={MessageSquareText}
              label="WHATSAPP"
              value="+91 8867867775"
              href="https://wa.me/918867867775"
              external
            />
            <ContactTile
              Icon={Mail}
              label="EMAIL US"
              value="contact@skyupdigitalsolutions.com"
              href="mailto:contact@skyupdigitalsolutions.com"
            />
            <ContactTile
              Icon={Globe}
              label="WEBSITE"
              value="www.skyupdigitalsolutions.com"
              href="https://www.skyupdigitalsolutions.com"
              external
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactTile({ Icon, label, value, href, external = false }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="
        group no-underline
        flex items-center gap-4
        rounded-xl bg-[#F5F7FF]
        px-3  py-4
        border border-white/60
        shadow-[0_10px_26px_rgba(0,0,0,0.10)]
        hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(0,0,0,0.14)]
        transition-all
      "
    >
      <div className="h-12 w-12 rounded-lg flex items-center justify-center">
        <Icon className="h-6 w-6 text-[#0B3BFF]" />
      </div>

      <div>
        <div className="text-[16px] font-bold tracking-wide text-[#111827]">
          {label}
        </div>
        <div className="mt-0.5 text-[12px] sm:text-[13px] font-bold text-gray-600 truncate">
          {value}
        </div>
      </div>
    </a>
  );
}
