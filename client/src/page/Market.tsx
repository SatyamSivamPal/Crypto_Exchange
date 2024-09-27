import { useEffect, useState } from "react";
import {
  getPriceChange,
  New,
  PopularCoins,
  TopGainers,
} from "../utils/httpClient";
import CoinCard, { Coin } from "../components/CoinCard";
import MarketSkeleton from "../skleton/FrontPage";
import { MarketData } from "../utils/type";
import { getTickersKline } from "../utils/FetchKlineMarket";
import { formatNumber } from "../components/MarketTable";


const Market = () => {
  const [newCoins, setNewCoins] = useState<Coin[]>([]);
  const [topGainers, setTopGainers] = useState<Coin[]>([]);
  const [popular, setPopular] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"spot" | "favorite">("spot");
  const [ticker, setTicker] = useState<MarketData[] | undefined>(undefined);
  const [priceData, setPriceData] = useState<{
    [key: string]: { priceChange24h: number }[];
  }>({});

  const PriceGraph = async (name: string) => {
    const priceChange = await getPriceChange(name);
    return priceChange;
  };

  // Extract prices at hourly intervals from the data
  const getPricesInIntervals = (
    priceChangeData: [number, number][]
  ): { priceChange24h: number }[] => {
    priceChangeData.sort((a, b) => a[0] - b[0]);

    const selectedPrices: { priceChange24h: number }[] = [];
    const interval = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
    const currentTime = priceChangeData[priceChangeData.length - 1][0];
    let previousTime = currentTime - 24 * 60 * 60 * 1000; // 24 hours ago

    for (let i = priceChangeData.length - 1; i >= 0; i--) {
      const [timestamp, price] = priceChangeData[i];
      if (timestamp >= previousTime) {
        selectedPrices.push({ priceChange24h: price });
        previousTime += interval;
      }
    }

    return selectedPrices.reverse(); // Reverse to maintain chronological order
  };

  const init2 = async () => {
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
      console.log("Error ooccured in the front page table", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init2();
  }, []);

  const handleTabClick = (tab: "spot" | "favorite") => {
    setActiveTab(tab);
  };

  async function init() {
    try {
      console.log(newCoins);
      setNewCoins(await New());
      setTopGainers(await TopGainers());
      setPopular(await PopularCoins());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    init();
  }, []);

  if (loading) {
    return <MarketSkeleton />;
  }

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
              <p className="font-bold text-4xl text-white font-roboto">
                Markets
              </p>
            </div>

            <div className="flex flex-row justify-between mt-1 space-x-4">
              <div className="flex flex-1 flex-col bg-portfolioBackground rounded-lg p-6 text-white">
                <h2 className="text-xl font-bold font-roboto mb-4 bg-transparent">
                  New
                </h2>

                <div className="space-y-2 bg-transparent">
                  {newCoins.map((coin) => (
                    <CoinCard key={coin.id} coin={coin} />
                  ))}
                </div>
              </div>

              <div className="flex flex-1 flex-col bg-portfolioBackground rounded-lg p-6 text-white">
                <h4 className="text-xl font-bold font-roboto mb-4 bg-transparent">
                  Top Gainers
                </h4>
                <div className="space-y-2 bg-transparent">
                  {topGainers.map((coin) => (
                    <CoinCard key={coin.id} coin={coin} />
                  ))}
                </div>
              </div>

              <div className="flex flex-1 flex-col bg-portfolioBackground rounded-lg p-6 text-white">
                <h2 className="text-xl font-bold font-roboto mb-4 bg-transparent">
                  Popular
                </h2>
                <div className="space-y-2 bg-transparent">
                  {popular.map((coin) => (
                    <CoinCard key={coin.id} coin={coin} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col pb-1">
        <div className="flex justify-center flex-row mx-[24px]">
          <div className="flex flex-col max-w-[1250px] flex-1">
            <div className="flex items-center flex-row my-1">
              <div className="flex flex-row">
                <div
                  className={`flex-1 px-4 py-1 rounded-lg text-center font-bold cursor-pointer text-lg ${
                    activeTab === "spot"
                      ? "bg-spot  text-blue-500"
                      : "text-gray-400"
                  }`}
                  onClick={() => handleTabClick("spot")}
                >
                  Spot
                </div>
                <div
                  className={`flex-1 ml-2 px-4 py-1 rounded-lg text-center font-bold cursor-pointer ${
                    activeTab === "favorite"
                      ? " bg-spot  text-blue-500"
                      : "text-gray-400"
                  }`}
                  onClick={() => handleTabClick("favorite")}
                >
                  Favorite
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col pb-4 mt-4">
          <div className="flex justify-center flex-row mx-[24px]">
            <div className="flex flex-col max-w-[1260px] flex-1 bg-baseBackgroundL3 rounded-lg shadow-lg">
              <div className="flex items-center flex-row my-3 bg-transparent">
                <div className="flex flex-row rounded-lg w-full overflow-x-auto bg-transparent">
                  <table className="w-full table-auto bg-transparent">
                    <thead className="text-white bg-transparent">
                      <tr className="font-roboto bg-transparent">
                        <th className="px-2 py-3 text-md font-semibold text-left first:pl-7 bg-transparent">
                          Name
                        </th>
                        <th className="px-2 py-2 text-md font-semibold text-right bg-transparent">
                          Price
                        </th>
                        <th className="px-2 py-3 text-md font-semibold text-right bg-transparent">
                          Market Cap
                        </th>
                        <th className="px-2 py-3 text-md font-semibold text-right bg-transparent">
                          24h Volume
                        </th>
                        <th className="px-2 py-3 text-md font-semibold text-right bg-transparent">
                          24h Change
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-white bg-transparent font-roboto">
                      {ticker &&
                        ticker.map((coin, index) => (
                          <tr
                            key={index}
                            className="font-roboto text-sm text-right bg-transparent cursor-pointer"
                          >
                            <div className="flex-1 flex items-center gap-2 font-roboto bg-transparent p-4">
                              <img
                                src={coin.image}
                                alt={coin.name}
                                className="w-10 h-10 rounded-full bg-transparent"
                              />
                              <div className="font-bold text-white bg-transparent text-md">
                                {coin.name}
                              </div>
                            </div>
                            <td className="px-2 py-3 bg-transparent text-md font-roboto">
                              ${formatNumber(Number(coin.currencies.usd.price))}
                            </td>
                            <td className="px-2 py-3 bg-transparent ">
                              $
                              {formatNumber(
                                Number(coin.currencies.usd.market_cap)
                              )}
                            </td>
                            <td className="px-2 py-3 bg-transparent ">
                              $
                              {formatNumber(Number(coin.currencies.usd.volume))}
                            </td>
                            <td className="px-2 py-3 bg-transparent">
                              <p
                                className={`font-medium tabular-nums text-lg bg-transparent ${
                                  Number(
                                    coin.currencies.usd
                                      .price_change_percentage_24hr
                                  ) > 0
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                              >
                                {Number(
                                  coin.currencies.usd
                                    .price_change_percentage_24hr
                                ).toFixed(2)}
                                %
                              </p>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;
