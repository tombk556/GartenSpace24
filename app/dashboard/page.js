import React from 'react'
import ProtectedRoute from '@components/ProtectedRoute'

const page = () => {
  return (
    <ProtectedRoute>
      <div>
          <h1>Dashboard</h1>
      </div>
    </ProtectedRoute>
  )
}

export default page
