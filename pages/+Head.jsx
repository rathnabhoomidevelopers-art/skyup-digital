// pages/+Head.jsx
import { usePageContext } from "vike-react/usePageContext";

export default function Head() {
  const { config } = usePageContext();
  const description = config?.metaDescription || "";

  return (
    <>
      {description && <meta name="description" content={description} />}
      {config?.keywords && <meta name="keywords" content={config.keywords} />}

      {/* Preconnect — keep these */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      {/* Non-blocking font load (was render-blocking before) */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
      />

      <link rel="icon" href="/images/skyup_logo1.svg" />
      <link rel="apple-touch-icon" href="/images/skyup_logo1.svg" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#000000" />
      <meta name="robots" content="index, follow" />

      {/* ✅ GTM deferred — loads after page is interactive */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          window.addEventListener('load', function() {
            setTimeout(function() {
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),
                dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-P9ZNGSFR');
            }, 2500);
          });
        `,
        }}
      />
    </>
  );
}
