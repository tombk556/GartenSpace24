import React from 'react'
import ProtectedRoute from '@components/ProtectedRoute'
import EntityForm from './components/EntityForm'

const page = () => {
  return (
    <ProtectedRoute>
      <div>
          <EntityForm />
      </div>
    </ProtectedRoute>
  )
}

export default page
