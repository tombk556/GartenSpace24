import React from 'react'
import ProtectedRoute from '@components/ProtectedRoute'
import AdvertForm from './components/AdvertForm'

const page = () => {
  return (
    <ProtectedRoute>
      <div>
          <AdvertForm />
      </div>
    </ProtectedRoute>
  )
}

export default page
