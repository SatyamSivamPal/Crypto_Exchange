import React from 'react';

interface AskTableProps {
  asks: [string, string][];
  maxDisplayedAsks?: number; // Optional prop for maximum number of asks to display
}

export const AskTable: React.FC<AskTableProps> = ({ asks, maxDisplayedAsks = 6 }) => {
  let currentTotal = 0;
  
  // Limit the number of asks to `maxDisplayedAsks` and reverse the order
  const relevantAsks = asks.slice(0, maxDisplayedAsks).reverse();

  const asksWithTotal: [string, string, number][] = relevantAsks.map(([price, quantity]) => {
    currentTotal += Number(quantity);
    return [price, quantity, currentTotal];
  });

  const maxTotal = relevantAsks.reduce(
    (acc, [_, quantity]) => acc + Number(quantity),
    0
  );

  return (
    <div className="text-white">
      {asksWithTotal.reverse().map(([price, quantity, total]) => (
        <Ask
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

function Ask({
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
        className="absolute top-0 left-0 h-full bg-red-500 opacity-20 rounded-lg"
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
