'use client'

import Portal from '@/components/portal/Portal'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function PortalPage() {
  return (
    <ProtectedRoute>
      <Portal />
    </ProtectedRoute>
  )
}
