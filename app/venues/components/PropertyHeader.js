import React from 'react'

const PropertyHeader = ({ property }) => {
  return (
    <div>
      <h1 className="text-xl mb-4">{property.meta.type}: {property.meta.description}</h1>
    </div>
  )
}

export default PropertyHeader
