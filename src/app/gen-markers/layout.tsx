import { GoogleMapsProvider } from '@/lib/GoogleMapsProvider'
import React from 'react'

export default function layout({children}: {children: React.ReactNode}) {
  return (
    <GoogleMapsProvider>
        {children}
    </GoogleMapsProvider>
  )
}
