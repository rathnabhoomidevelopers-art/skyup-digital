import React from 'react'
import { Head } from 'vike-react/Head'
import '../../src/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { HomePage } from '../../src/pages/HomePage'

export default function Page() {
  return (
    <>
      <Head>
        <title>Digital Marketing Agency in Bangalore | SkyUp Digital</title>
        <meta name="description" content="Your trusted Digital Marketing Agency in Bangalore, delivering smart strategies, measurable results, and sustainable growth for your brand." />
        <meta name="keywords" content="Digital Marketing Agency in Bangalore." />
        <link rel="canonical" href="https://www.skyupdigitalsolutions.com" />
      </Head>
      <HomePage />
    </>
  )
}