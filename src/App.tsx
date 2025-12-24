import React from 'react'
import { 
  QueryProvider,
  AuthProvider,
  TenantProvider
} from "@gaqno-dev/frontcore"

function ERPPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">ERP Module</h1>
      <p className="text-muted-foreground mt-2">ERP functionality coming soon...</p>
    </div>
  )
}

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <TenantProvider>
          <ERPPage />
        </TenantProvider>
      </AuthProvider>
    </QueryProvider>
  )
}

