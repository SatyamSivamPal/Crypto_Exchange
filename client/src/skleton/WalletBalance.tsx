import React from 'react';

const SkeletonRow: React.FC = () => (
  <div className="grid grid-cols-5 text-gray-300 gap-5 py-4 border-b border-gray-700 animate-pulse">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gray-600 rounded-full" />
      <div className="pl-2 flex flex-col">
        <div className="w-32 h-4 bg-gray-600 rounded" />
        <div className="w-16 h-4 bg-gray-600 rounded mt-2" />
      </div>
    </div>
    <div className="w-24 h-4 bg-gray-600 rounded" />
    <div className="w-24 h-4 bg-gray-600 rounded" />
    <div className="w-24 h-4 bg-gray-600 rounded" />
    <div className="flex gap-2">
      <div className="w-24 h-4 bg-gray-600 rounded" />
      <div className="w-24 h-4 bg-gray-600 rounded" />
      <div className="w-24 h-4 bg-gray-600 rounded" />
    </div>
  </div>
);

const WalletBalance: React.FC = () => (
  <div className="h-screen p-8">
    <div className="mx-auto w-full max-w-[1224px] overflow-x-auto">
      <div className="flex flex-col w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-row h-12">
          <div className="flex items-center flex-row gap-6">
            <h1 className="text-3xl font-semibold text-gray-400">Balances</h1>
          </div>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-5 gap-5 border-b border-gray-700 pb-2 text-gray-400">
          <div className="font-semibold">Assets</div>
          <div className="font-semibold">Total Balance</div>
          <div className="font-semibold">Available Balance</div>
          <div className="font-semibold">USD Value</div>
          <div className="font-semibold">Actions</div>
        </div>

        {/* Skeleton Data Rows */}
        <div className="flex flex-col space-y-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default WalletBalance;
