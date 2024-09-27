import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";

interface Coin {
  symbol: string;
  logo: string;
  price: number;
  change: number;
}

const defaultCoins: Coin[] = [
  { symbol: "BTC", logo: "https://backpack.exchange/_next/image?url=%2Fcoins%2Fbtc.png&w=32&q=75", price: 0, change: 0 },
  { symbol: "ETH", logo: "https://backpack.exchange/_next/image?url=%2Fcoins%2Feth.png&w=32&q=75", price: 0, change: 0 },
  { symbol: "IO", logo: "https://backpack.exchange/_next/image?url=%2Fcoins%2Fio.png&w=32&q=75", price: 0, change: 0 },
  { symbol: "HABIBI", logo: "https://backpack.exchange/_next/image?url=%2Fcoins%2Fhabibi.png&w=32&q=75", price: 0, change: 0 },
  { symbol: "SOL", logo: "https://backpack.exchange/_next/image?url=%2Fcoins%2Fsol.png&w=32&q=75", price: 0, change: 0 }
];

interface MarketSearchProps {
  onSelectMarket: (market: string) => void;
}

const MarketSearch: React.FC<MarketSearchProps> = ({ onSelectMarket }) => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Coin[]>(defaultCoins);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDefaultCoinData = async () => {
      try {
        const response = await fetch(
          "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=5&start=1&convert=USD",
          {
            headers: {
              "X-CMC_PRO_API_KEY": "aed4c3f6-40b8-4a22-b9c5-111617e59a03" 
            }
          }
        );
        const data = await response.json();
        
        const updatedCoins = defaultCoins.map((coin) => {
          const matchedCoin = data.data.find((item: any) => item.symbol === coin.symbol);
          return matchedCoin
            ? {
                ...coin,
                price: matchedCoin.quote.USD.price,
                change: matchedCoin.quote.USD.percent_change_24h
              }
            : coin;
        });

        setSuggestions(updatedCoins);
      } catch (error) {
        console.error("Error fetching default coin prices:", error);
      }
    };

    fetchDefaultCoinData();
  }, []);

  const fetchMarketSuggestions = useCallback(
    debounce(async (searchTerm: string) => {
      if (!searchTerm.trim()) return;

      try {
        const response = await fetch(
          `https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?symbol=${searchTerm.toUpperCase()}`,
          {
            headers: {
              "X-CMC_PRO_API_KEY": "aed4c3f6-40b8-4a22-b9c5-111617e59a03" // Replace with your API key
            }
          }
        );
        const data = await response.json();

        const marketSuggestions: Coin[] = data.data
          .map((coin: any) => ({
            symbol: coin.symbol,
            logo: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
            price: 0, // Fetch price separately if needed
            change: 0 // Fetch change separately if needed
          }));

        setSuggestions(marketSuggestions);
        setError(null);
      } catch (error) {
        console.error("Error fetching market suggestions:", error);
        setError("Failed to fetch market suggestions.");
        setSuggestions([]);
      }
    }, 300),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 1) {
      fetchMarketSuggestions(value);
    } else {
      setSuggestions(defaultCoins);
    }
  };

  const handleMarketSelect = (market: string) => {
    setQuery(market);
    onSelectMarket(market);
    setSuggestions([]);
    navigate(`/trade/${market}_USDT`);
    setIsFocused(false);
  };

  return (
    <div className="pl-1 relative max-w-xl font-roboto">
      <input
        type="text"
        className="block w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search market or coin..."
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
      />
      {error && <p className="text-red-500">{error}</p>}
      {isFocused && suggestions.length > 0 && (
        <ul className="absolute top-full left-1 w-96 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto mt-2 bg-portfolioBackground">
          {suggestions.map(({ symbol, logo, price, change }, index) => (
            <li
              key={index}
              className="cursor-pointer transition duration-200 ease-in-out px-3 py-1 text-white hover:bg-slate-800 flex items-center bg-transparent"
              onMouseDown={() => handleMarketSelect(symbol)}
            >
              <img
                src={logo}
                alt={symbol}
                onError={(e) => (e.currentTarget.src = 'fallback-logo-url.png')}
                className="w-6 h-6 mr-3 bg-transparent"
              />
              <div className="flex flex-grow justify-between items-center bg-transparent">
                <span className="text-white font-medium bg-transparent">{symbol}</span>
                <div className="flex flex-col text-right bg-transparent">
                  <span className="text-md text-gray-400 bg-transparent">${price.toFixed(2)}</span>
                  <span className={`text-sm bg-transparent ${change > 0 ? "text-green-500" : "text-red-500"}`}>
                    {change.toFixed(2)}%
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MarketSearch;
