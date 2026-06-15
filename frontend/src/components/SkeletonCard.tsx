import React from 'react';

export const SkeletonCard = () => (
  <div className="flex-shrink-0 w-36 md:w-44">
    <div className="skeleton w-full aspect-[2/3] rounded-xl" />
    <div className="skeleton h-3 w-3/4 rounded mt-2" />
    <div className="skeleton h-2 w-1/2 rounded mt-1" />
  </div>
);

export const SkeletonRow = () => (
  <div className="mb-10">
    <div className="skeleton h-5 w-48 rounded mb-4 mx-4 md:mx-12" />
    <div className="flex gap-3 px-4 md:px-12 overflow-hidden">
      {Array.from({length:6}).map((_,i) => <SkeletonCard key={i} />)}
    </div>
  </div>
);
