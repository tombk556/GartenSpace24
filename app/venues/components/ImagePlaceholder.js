
const ImagePlaceholder = () => {
    return (
      <div className="grid grid-cols-12 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className={`col-span-6 md:col-span-4 lg:col-span-${index % 5 === 0 ? '6' : '3'} row-span-${index % 3 === 0 ? '2' : '1'} relative`}
          >
            <div className="w-full h-full bg-gray-300 animate-pulse rounded-lg shadow-lg"></div>
          </div>
        ))}
      </div>
    );
  };
  
  export default ImagePlaceholder;
  