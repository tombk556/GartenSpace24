import React from 'react'

const ImageCard = ({images}) => {
  return (
    <div>
    {images.length > 0 && (
        <div className="image-gallery mt-4">
          <div className="grid grid-cols-12 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className={`col-span-6 md:col-span-4 lg:col-span-${index % 5 === 0 ? '6' : '3'} row-span-${index % 3 === 0 ? '2' : '1'} relative`}
              >
                <img
                  src={image.url}
                  alt={`Property Image ${image.name}`}
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
                <p className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">{image.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageCard
