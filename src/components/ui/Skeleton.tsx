import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> & {
  Card: React.FC<SkeletonProps>;
  List: React.FC<SkeletonProps>;
  Text: React.FC<SkeletonProps & { lines?: number }>;
} = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-purple-900/20 rounded-md ${className}`} />
  );
};

Skeleton.Card = ({ className = '' }) => (
  <div className={`bg-[#1a001f] border border-purple-900/30 rounded-xl p-6 ${className}`}>
    <Skeleton className="h-6 w-3/4 mb-4" />
    <Skeleton className="h-4 w-1/2 mb-8" />
    <div className="space-y-2 mt-4 pt-4 border-t border-purple-900/20">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  </div>
);

Skeleton.List = ({ className = '' }) => (
  <div className={`flex items-center p-4 bg-[#1a001f] border border-purple-900/30 rounded-xl ${className}`}>
    <Skeleton className="h-12 w-12 rounded-lg mr-4" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-1/2 opacity-60" />
    </div>
  </div>
);

Skeleton.Text = ({ className = '', lines = 3 }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        className={`h-4 ${
          i === lines - 1 ? 'w-2/3' : 
          i === 0 ? 'w-5/6' : 'w-full'
        }`} 
      />
    ))}
  </div>
);
