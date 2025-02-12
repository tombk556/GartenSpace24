import React from 'react'
import ProtectedRoute from '@components/ProtectedRoute'
import Profile from './Profile'
const page = () => {
  return (
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  )
}

export default page