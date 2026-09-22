import React from 'react';

export const PostSkeleton = () => (
  <div className="card p-4 space-y-3">
    <div className="flex items-start gap-3">
      <div className="skeleton w-11 h-11 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton h-3 w-48 rounded" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-3/4 rounded" />
    </div>
    <div className="flex gap-2 pt-2 border-t border-dark-100 dark:border-dark-700">
      <div className="skeleton h-8 flex-1 rounded-lg" />
      <div className="skeleton h-8 flex-1 rounded-lg" />
      <div className="skeleton h-8 flex-1 rounded-lg" />
    </div>
  </div>
);

export const ProfileCardSkeleton = () => (
  <div className="card p-4 space-y-3">
    <div className="skeleton w-full h-20 rounded-lg" />
    <div className="flex items-center gap-3">
      <div className="skeleton w-16 h-16 rounded-full" />
      <div className="space-y-2 flex-1">
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton h-3 w-48 rounded" />
      </div>
    </div>
    <div className="skeleton h-9 w-full rounded-lg" />
  </div>
);

export const JobCardSkeleton = () => (
  <div className="card p-4 space-y-3">
    <div className="flex items-start gap-3">
      <div className="skeleton w-12 h-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-40 rounded" />
        <div className="skeleton h-3 w-28 rounded" />
        <div className="skeleton h-3 w-36 rounded" />
      </div>
    </div>
    <div className="flex gap-2">
      <div className="skeleton h-7 w-20 rounded-full" />
      <div className="skeleton h-7 w-20 rounded-full" />
    </div>
    <div className="skeleton h-9 w-full rounded-lg" />
  </div>
);
