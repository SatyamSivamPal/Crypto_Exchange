import React from 'react';

export interface Coin {
  id: number;
  symbol: string;
  quote: {
    USD: {
      price: number;
      percent_change_24h: number;
    };
  };
}

const CoinCard: React.FC<{ coin: Coin }> = ({ coin }) => (
  <div
    key={coin.id}
    className="flex items-center justify-between p-1/2 rounded-lg text-white bg-transparent font-roboto"
  >
    <div className="flex items-center bg-transparent">
      <img
        src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`}
        alt={coin.symbol}
        className="w-8 h-8 rounded-full mr-4 bg-transparent"
      />
      <p className="text-lg font-bold bg-transparent">{coin.symbol.toUpperCase()}</p>
    </div>

    <p className="text-lg bg-transparent">${coin.quote.USD.price.toFixed(4)}</p>

    <p
      className={`text-lg bg-transparent ${
        coin.quote.USD.percent_change_24h >= 0 ? 'text-green-500' : 'text-red-500'
      }`}
    >
      {coin.quote.USD.percent_change_24h.toFixed(2)}%
    </p>
  </div>
);

export default CoinCard;
