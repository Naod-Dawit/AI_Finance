import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="container mx-auto p-8 space-y-12 bg-gray-700 text-gray-100">
      {/* Header Skeleton */}
      <div className="text-center space-y-2 animate-pulse">
        <div className="h-8 bg-gray-600 w-1/2 mx-auto rounded"></div>
      </div>

      {/* Grid Layout Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
        {/* Financial Summary Skeleton */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 space-y-4 animate-pulse">
          <div className="h-12 bg-gray-600 w-full rounded"></div>
          <div className="h-6 bg-gray-600 w-3/4 rounded"></div>
          <div className="h-4 bg-gray-600 w-1/2 rounded"></div>
          <div className="h-4 bg-gray-600 w-1/2 rounded"></div>
          <div className="h-4 bg-gray-600 w-1/2 rounded"></div>

          {/* Comparison Section Skeleton */}
          <div className="mt-4 bg-gray-700 p-6 rounded-lg space-y-4">
            <div className="h-6 bg-gray-600 w-1/2 rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32 bg-gray-600 rounded"></div>
              <div className="h-32 bg-gray-600 rounded"></div>
            </div>
            <div className="h-8 bg-gray-600 w-full rounded"></div>
          </div>
        </div>

        {/* Pie Chart Skeleton */}
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 space-y-4 animate-pulse">
          <div className="h-10 bg-gray-600 w-1/2 rounded"></div>
          <div className="h-6 bg-gray-600 w-full rounded"></div>
          <div className="w-full aspect-square bg-gray-600 rounded-full"></div>
        </div>
      </div>

      {/* Line Chart Skeleton */}
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 space-y-4 animate-pulse">
        <div className="h-8 bg-gray-600 w-1/4 rounded"></div>
        <div className="h-64 bg-gray-600 w-full rounded"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
