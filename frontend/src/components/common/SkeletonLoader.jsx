const SkeletonLoader = ({ className = '', variant = 'default' }) => {
  const variants = {
    default: 'h-4 bg-gray-200 rounded',
    text: 'h-4 bg-gray-200 rounded w-3/4',
    title: 'h-6 bg-gray-200 rounded w-1/2',
    avatar: 'h-12 w-12 bg-gray-200 rounded-full',
    card: 'h-48 bg-gray-200 rounded-lg',
    button: 'h-10 bg-gray-200 rounded-lg w-24',
  };

  return (
    <div className={`animate-pulse ${variants[variant]} ${className}`} />
  );
};

export const JobCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <SkeletonLoader variant="title" className="mb-2" />
          <SkeletonLoader variant="text" className="w-1/3" />
        </div>
        <SkeletonLoader variant="avatar" />
      </div>
      <SkeletonLoader variant="text" className="mb-2" />
      <SkeletonLoader variant="text" className="w-2/3 mb-4" />
      <div className="flex gap-2 mb-4">
        <SkeletonLoader className="h-6 w-20" />
        <SkeletonLoader className="h-6 w-24" />
        <SkeletonLoader className="h-6 w-16" />
      </div>
      <div className="flex justify-between items-center">
        <SkeletonLoader className="w-32" />
        <SkeletonLoader variant="button" />
      </div>
    </div>
  );
};

export const ApplicationCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <SkeletonLoader variant="title" className="mb-2" />
          <SkeletonLoader variant="text" className="w-1/2" />
        </div>
        <SkeletonLoader className="h-6 w-24" />
      </div>
      <SkeletonLoader variant="text" className="mb-2" />
      <SkeletonLoader variant="text" className="w-3/4" />
    </div>
  );
};

export const ProfileSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="flex items-center mb-6">
        <SkeletonLoader variant="avatar" className="mr-4" />
        <div className="flex-1">
          <SkeletonLoader variant="title" className="mb-2" />
          <SkeletonLoader variant="text" className="w-1/3" />
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <SkeletonLoader className="w-24 mb-2" />
          <SkeletonLoader variant="text" />
        </div>
        <div>
          <SkeletonLoader className="w-24 mb-2" />
          <SkeletonLoader variant="text" />
        </div>
        <div>
          <SkeletonLoader className="w-24 mb-2" />
          <SkeletonLoader variant="text" className="w-2/3" />
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <SkeletonLoader key={i} className="h-4 w-24" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <SkeletonLoader key={colIndex} className="h-4 flex-1" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
