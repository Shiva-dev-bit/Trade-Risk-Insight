'use client'

import dynamic from 'next/dynamic'
import SoftBoxRoot from '../../components/SoftBox/SoftBoxRoot'
import { SoftUIControllerProvider } from '../../context'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/Authcontext'
import { StockProvider } from '../../context/StockContext'

const App = dynamic(() => import('../../App'), { ssr: false })

export function ClientOnly() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <StockProvider>
        <SoftUIControllerProvider>
          <App />
        </SoftUIControllerProvider>
      </StockProvider>
    </AuthProvider>
  </BrowserRouter>
  )
}