
const ImagePlaceholder = () => {
    return (
      <div className="grid grid-cols-3 gap-4 h-510px] overflow-auto flex-grow lg:w-4/5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="w-full h-[240px]">
            <div className="w-full h-full bg-gray-300 animate-pulse rounded-lg shadow-lg"></div>
          </div>
        ))}
      </div>
    );
  };
  
  export default ImagePlaceholder;
  