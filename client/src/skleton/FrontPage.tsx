import React from 'react';


const CoinCardSkeleton: React.FC = () => (
  <div
    className="flex items-center justify-between p-1/2 rounded-lg text-white bg-transparent font-roboto animate-pulse"
  >
    <div className="flex items-center bg-transparent">
      <div className="w-8 h-8 rounded-full bg-gray-700 mr-4" />
      <div className="w-16 h-4 bg-gray-700 rounded bg-transparent" />
    </div>

    <div className="w-12 h-4 bg-gray-700 rounded bg-transparent" />

    <div className="w-8 h-4 bg-gray-700 rounded bg-transparent" />
  </div>
);


// Full Skeleton Page
const MarketSkeleton = () => {
  return (
    <div className="flex flex-col flex-1">
      <div className="relative flex flex-col justify-center items-center flex-1 pt-[20px] text-white">
        <div className="relative w-full max-w-[1250px]">
          <img
            src="/image.jpg"
            alt="Market"
            className="rounded-xl w-full h-auto"
          />
          <div className="absolute top-0 left-0 flex flex-col justify-center bg-black bg-opacity-50 rounded-l-xl p-8 max-w-[44%] bg-transparent mt-12 h-full">
            <h1 className="text-6xl font-bold mb-1 bg-transparent font-roboto">
              Refer and Earn
            </h1>
            <p className="text-xl bg-transparent text-slate-400 font-roboto">
              Refer a friend and earn a percentage of their trading fees.
            </p>
            <button className="mt-4 px-1 py-2 bg-white text-black rounded font-semibold">
              Manage Referrals
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col pb-8">
        <div className="flex justify-center flex-row mx-[24px]">
          <div className="flex flex-col max-w-[1250px] flex-1">
            <div className="flex items-center flex-row my-4">
              <p className="font-bold text-4xl text-white font-roboto">Markets</p>
            </div>
            
            <div className="flex flex-row justify-between mt-6 space-x-4">
              <div className="flex flex-1 flex-col bg-portfolioBackground rounded-lg p-6 text-white">
                <h2 className="text-xl font-bold font-roboto mb-4 bg-transparent">New</h2>
                <div className="space-y-2 bg-transparent">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <CoinCardSkeleton key={idx} />
                  ))}
                </div>
              </div>
              <div className="flex flex-1 flex-col bg-portfolioBackground rounded-lg p-6 text-white">
                <h4 className="text-xl font-bold font-roboto mb-4 bg-transparent">Top Gainers</h4>
                <div className="space-y-2 bg-transparent">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <CoinCardSkeleton key={idx} />
                  ))}
                </div>
              </div>
              <div className="flex flex-1 flex-col bg-portfolioBackground rounded-lg p-6 text-white">
                <h2 className="text-xl font-bold font-roboto mb-4 bg-transparent">Popular</h2>
                <div className="space-y-2 bg-transparent">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <CoinCardSkeleton key={idx} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketSkeleton;
