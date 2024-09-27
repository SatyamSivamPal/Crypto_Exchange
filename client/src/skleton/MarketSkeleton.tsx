import React from "react";

const SkeletonBox = ({ width = "100%", height = "24px" }: { width?: string; height?: string }) => (
  <div
    className={`bg-gray-700 animate-pulse rounded`}
    style={{ width, height }}
  />
);

const MarketSkeleton: React.FC = () => {
  return (
    <div className="overflow-x-auto p-2">
      <div className="flex flex-col space-y-2">
        {/* Header Skeleton */}
        <div className="flex border-b border-gray-800 p-2 font-medium text-gray-400 uppercase tracking-wider font-roboto">
          <div className="flex-1">
            <SkeletonBox width="150px" height="16px" />
          </div>
          <div className="flex-1 text-right">
            <SkeletonBox width="100px" height="16px" />
          </div>
          <div className="flex-1 text-right">
            <SkeletonBox width="120px" height="16px" />
          </div>
          <div className="flex-1 text-right">
            <SkeletonBox width="120px" height="16px" />
          </div>
          <div className="flex-1 text-right">
            <SkeletonBox width="100px" height="16px" />
          </div>
          <div className="flex-1 text-right">
            {/* Empty space for Chart */}
          </div>
        </div>

        {/* Rows Skeleton */}
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4 border-b border-gray-800 p-2">
            {/* Name Skeleton */}
            <div className="flex-1 flex items-center gap-2">
              {/* <SkeletonBox width="40px" height="40px" /> */}
              <SkeletonBox width="150px" height="24px" />
            </div>

            {/* Price Skeleton */}
            <div className="flex-1 text-right">
              <SkeletonBox width="100px" height="24px" />
            </div>

            {/* Market Cap Skeleton */}
            <div className="flex-1 text-right">
              <SkeletonBox width="120px" height="24px" />
            </div>

            {/* 24h Volume Skeleton */}
            <div className="flex-1 text-right">
              <SkeletonBox width="120px" height="24px" />
            </div>

            {/* 24h Change Skeleton */}
            <div className="flex-1 text-right">
              <SkeletonBox width="100px" height="24px" />
            </div>

            {/* Chart Skeleton */}
            <div className="flex-1 ml-8">
              <SkeletonBox width="150px" height="24px" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketSkeleton;
