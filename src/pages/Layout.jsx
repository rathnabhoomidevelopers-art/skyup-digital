import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import '../../src/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

export default function Layout({ children, pageContext }) {
  return (
    <HelmetProvider>
      <div id="app-wrapper">
        {children}
      </div>
    </HelmetProvider>
  )
}