import React, { useEffect, useState } from "react";
import { KLine, MarketData } from "../utils/type";
import { getTickersKline } from "../utils/FetchKlineMarket";
import MarketSkeleton from "../skleton/MarketSkeleton";
import LineChartComponent from "../utils/TradeView";
import { getPriceChange } from "../utils/httpClient";
import { Navigate, useNavigate } from "react-router-dom";


// Function to format numbers into readable strings
export const formatNumber = (value: number): string => {
  if (value >= 1e12) return (value / 1e12).toFixed(2) + 'T'; // Trillion
  if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';  // Billion
  if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';  // Million
  return value.toFixed(2);
};

// Main component for displaying market data
const MarketTable: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ticker, setTicker] = useState<MarketData[] | undefined>(undefined);
  const [priceData, setPriceData] = useState<{ [key: string]: { priceChange24h: number }[] }>({}); // Key is the coin name
  const navigate = useNavigate();

  // Fetch price change data
  const PriceGraph = async (name: string) => {
    const priceChange = await getPriceChange(name);
    return priceChange;
  }

  // Extract prices at hourly intervals from the data
  const getPricesInIntervals = (priceChangeData: [number, number][]): { priceChange24h: number }[] => {
    priceChangeData.sort((a, b) => a[0] - b[0]);

    const selectedPrices: { priceChange24h: number }[] = [];
    const interval = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
    const currentTime = priceChangeData[priceChangeData.length - 1][0];
    let previousTime = currentTime - (24 * 60 * 60 * 1000); // 24 hours ago

    for (let i = priceChangeData.length - 1; i >= 0; i--) {
      const [timestamp, price] = priceChangeData[i];
      if (timestamp >= previousTime) {
        selectedPrices.push({ priceChange24h: price });
        previousTime += interval;
      }
    }

    return selectedPrices.reverse(); // Reverse to maintain chronological order
  }

  // Initialize component data
  const init = async () => {
    try {
      const res = await getTickersKline();
      setLoading(true);
      setTicker(res);

      // Fetch price changes for all tickers
      const priceChangeDataPromises = res.map(async (item: MarketData) => {
        const priceChangeData = await PriceGraph(item.name.toLowerCase());
        return { name: item.name, data: getPricesInIntervals(priceChangeData) };
      });

      const priceChangeDataArray = await Promise.all(priceChangeDataPromises);

      // Organize data by coin name
      const priceDataMap: { [key: string]: { priceChange24h: number }[] } = {};
      priceChangeDataArray.forEach(({ name, data }) => {
        priceDataMap[name] = data;
      });

      setPriceData(priceDataMap);

    } catch (err) {
      setError("Failed to fetch market data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, []);

  if (loading) return <div><MarketSkeleton /></div>;
  if (error) return <p>{error}</p>;

  const changeURL = (coinName: string) => {
    console.log(coinName);
    navigate(`/trade/${coinName.toUpperCase()}_USDT`);
  }

  return (
    <div className="overflow-x-auto p-2">
      <div className="flex flex-col space-y-2">
        {/* Header */}
        <div className="flex border-b border-gray-800 p-2 font-medium text-gray-400 uppercase tracking-wider font-roboto">
          <div className="flex-1">Name</div>
          <div className="flex-1 text-right">Price</div>
          <div className="flex-1 text-right">Market Cap</div>
          <div className="flex-1 text-right">24h Volume</div>
          <div className="flex-1 text-right">24h Change</div>
          <div className="flex-1 text-right"></div>
        </div>

        {/* Rows */}
        {ticker && ticker.map((item, index) => (
          <div key={index} className="flex items-center space-x-4 border-b border-gray-800 p-2 hover: cursor-pointer" onClick={() => changeURL(item.symbol)}>
            {/* Name */}
            <div className="flex-1 flex items-center gap-2 font-roboto">
              <img
                src={item.image}
                alt={item.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="font-bold text-white">{item.name}</div>
            </div>

            {/* Price */}
            <div className="flex-1 text-right text-lg text-white font-semibold font-roboto">
              ${formatNumber(Number(item.currencies.usd.price))}
            </div>

            {/* Market Cap */}
            <div className="flex-1 text-right text-lg text-white font-roboto">
              ${formatNumber(Number(item.currencies.usd.market_cap))}
            </div>

            {/* 24h Volume */}
            <div className="flex-1 text-right text-lg text-white font-roboto">
              ${formatNumber(Number(item.currencies.usd.volume))}
            </div>

            {/* 24h Change */}
            <div className="flex-1 text-right text-lg text-white font-roboto">
              <p className={`font-medium tabular-nums text-lg ${Number(item.currencies.usd.price_change_percentage_24hr) > 0 ? "text-green-500" : "text-red-500"}`}>
                {Number(item.currencies.usd.price_change_percentage_24hr).toFixed(2)}%
              </p>
            </div>

            {/* Chart */}
            
            <div className="flex-1 ml-8 text-lg mt-4">
              <LineChartComponent
                data={ priceData[item.name] || [] }
                width={200}
                height={80}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketTable;
