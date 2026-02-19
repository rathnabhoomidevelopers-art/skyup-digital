import React from 'react'
import '../../src/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { AuthProvider } from '../../src/context/AuthContext'

export default function Layout({ children, pageContext }) {
  return (
    <AuthProvider>
      <div id="app-wrapper">
        {children}
      </div>
    </AuthProvider>
  );
}