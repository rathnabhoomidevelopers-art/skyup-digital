import React from 'react'
import { Head } from 'vike-react/Head'
import { ContactUs } from '../../src/pages/ContactUs'

export default function Page() {
  return (
    <>
      <Head>
        <title>Contact Us | SKYUP Digital Solutions</title>
        <meta name="description" content="Have questions or ready to start? Contact us at SKYUP Digital Solutions to grow your business with expert digital marketing and web solutions." />
         <meta name="keywords" content="Contact us" />
        <link rel="canonical" href="https://www.skyupdigitalsolutions.com/contactus" />
      </Head>
      <ContactUs/>
    </>
  )
}