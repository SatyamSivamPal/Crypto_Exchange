import React from 'react';

interface BidTableProps {
  bids: [string, string][];
  maxDisplayedBids?: number; 
}

export const BidTable: React.FC<BidTableProps> = ({ bids, maxDisplayedBids = 7 }) => {
  let currentTotal = 0;
  
  
  const relevantBids = bids.slice(0, maxDisplayedBids);
  
  const bidsWithTotal: [string, string, number][] = relevantBids.map(([price, quantity]) => {
    currentTotal += Number(quantity);
    return [price, quantity, currentTotal];
  });

  const maxTotal = relevantBids.reduce(
    (acc, [_, quantity]) => acc + Number(quantity),
    0
  );

  return (
    <div className="text-white">
      {bidsWithTotal.map(([price, quantity, total]) => (
        <Bid
          key={price}
          price={price}
          quantity={quantity}
          total={total}
          maxTotal={maxTotal}
        />
      ))}
    </div>
  );
};

function Bid({
  price,
  quantity,
  total,
  maxTotal,
}: {
  price: string;
  quantity: string;
  total: number;
  maxTotal: number;
}) {
  return (
    <div className="relative flex items-center py-1 px-2 mb-1 bg-transparent text-sm rounded-lg">
      <div
        className="absolute top-0 left-0 h-full bg-green-600 opacity-20 rounded-lg"
        style={{
          width: `${(100 * total) / maxTotal}%`,
          transition: "width 0.3s ease-in-out",
        }}
      ></div>
      <div className="flex justify-between w-full relative z-10 bg-transparent">
        <span className="w-1/3 text-left text-gray-300 font-medium bg-transparent">{price}</span>
        <span className="w-1/3 text-center text-gray-400 font-light bg-transparent">{quantity}</span>
        <span className="w-1/3 text-right text-gray-300 font-medium bg-transparent">{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
