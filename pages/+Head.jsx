// pages/+Head.jsx
import { usePageContext } from 'vike-react/usePageContext'

export default function Head() {
  const { config, urlPathname } = usePageContext()

  return (
    <>
      {/* SSR-rendered meta tags — picked up by crawlers and initial page load */}
      {config?.description && (
        <meta name="description" content={config.description} />
      )}
      {config?.keywords && (
        <meta name="keywords" content={config.keywords} />
      )}
      <link
        rel="canonical"
        href={`https://www.skyupdigitalsolutions.com${urlPathname === '/' ? '' : urlPathname}`}
      />

      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet"
      />

      {/* Favicon */}
      <link rel="icon" href="/images/skyup_logo1.svg" />
      <link rel="apple-touch-icon" href="/images/skyup_logo1.svg" />
      <link rel="manifest" href="/manifest.json" />

      {/* Global meta */}
      <meta name="theme-color" content="#000000" />
      <meta name="robots" content="index, follow" />

      {/* GTM */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-P9ZNGSFR');`,
        }}
      />
    </>
  )
}