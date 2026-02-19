import React from 'react'
import '../../src/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

export default function Layout({ children, pageContext }) {
  return (
    <>
      <div id="app-wrapper">
        {children}
      </div>
    </>
  )
}