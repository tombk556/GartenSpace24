import React from 'react'
import ProtectedRoute from '@components/ProtectedRoute'
import ProfileForm from './components/ProfileForm'

const page = () => {
  return (
    <ProtectedRoute>
      <div>
          <ProfileForm />
      </div>
    </ProtectedRoute>
  )
}

export default page
