import { useEffect, useState } from "react";
import type { Ticker } from "../utils/type";
import WebSocketManager from "../utils/TickerRealtime";

const MarketBar = ({ market }: { market: string }) => {
  const [ticker, setTicker] = useState<Ticker | null>(null);
  const [coinImage, setCoinImage] = useState<string | null>(null);

  const fetchCoinData = async (coinId: string) => {
    const imageUrl = `https://backpack.exchange/_next/image?url=%2Fcoins%2F${coinId}.png&w=32&q=75`;
    return imageUrl;
  };
  
  useEffect(() => {
    const Market = formatString(market);
    WebSocketManager.subscribe(Market);
    const handleDepthUpdate = (data: Ticker | null) => {
      if (data) {
        setTicker(data);
      }
    };
    WebSocketManager.addSubscriber(handleDepthUpdate);

    const primaryCoinId = market.split("_")[0].toLowerCase();

    fetchCoinData(primaryCoinId).then((imageUrl) => {
      setCoinImage(imageUrl);
    });

    return () => {
      WebSocketManager.removeSubscriber(handleDepthUpdate);
      WebSocketManager.unsubscribe();
    };
  }, [market]);

  return (
    <div className="w-full border-b border-slate-800 p-2">
      <div className="flex items-center w-full">
        <Ticker market={market} coinImage={coinImage} />
        <div className="flex w-full items-center space-x-8 pl-2">
          <div className="flex flex-col h-full justify-center">
            <p
              className={`font-medium tabular-nums text-greenText text-lg text-green-500`}
            >
              ${Number(ticker?.lastPrice)?.toFixed(1)}
            </p>
            <p className="font-medium text-md tabular-nums text-white">
              ${Number(ticker?.lastPrice)?.toFixed(1)}
            </p>
          </div>
          <div className="flex flex-col">
            <p className={`font-medium text-slate-400 text-xs pl-3`}>
              {" "}
              24H Change{" "}
            </p>
            <p
              className={`font-medium tabular-nums leading-5 text-sm text-greenText pt-1 gap-1 ${
                Number(ticker?.priceChange) > 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {Number(ticker?.priceChange) > 0 ? "+" : ""}
              {Number(ticker?.priceChange).toFixed(1)}{" "}
              {Number(ticker?.priceChangePercent)?.toFixed(2)}%
            </p>
          </div>
          <div className="flex flex-col">
            <p className="font-medium text-slate-400 text-xs">24H High</p>
            <p className="font-medium tabular-nums leading-5 text-sm text-white pt-1">
              {Number(ticker?.highPrice).toFixed(1)}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="font-medium text-slate-400 text-xs">24H Low</p>
            <p className="text-sm font-medium tabular-nums leading-5 text-white pt-1">
              {Number(ticker?.lowPrice).toFixed(1)}
            </p>
          </div>
          <button
            type="button"
            className="font-medium transition-opacity hover:opacity-80 hover:cursor-pointer text-base text-left"
            data-rac=""
          >
            <div className="flex flex-col">
              <p className="font-medium text-slate-400 text-xs">
                24H Volume (USDC)
              </p>
              <p className="font-medium tabular-nums leading-5 text-sm text-white pt-1">
                {Number(ticker?.volume).toFixed(2)}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketBar;

function Ticker({
  market,
  coinImage,
}: {
  market: string;
  coinImage: string | null;
}) {
  return (
    <div className="flex h-[60px] shrink-0 space-x-4">
      <div className="flex flex-row ml-2 -mr-4 justify-center w-full items-center">
        {coinImage ? (
          <img
            alt={`${market} Logo`}
            loading="lazy"
            decoding="async"
            className="z-10 rounded-full h-8 w-8  outline-baseBackgroundL1"
            src={coinImage}
          />
        ) : (
          <div className="h-8 w-8 bg-gray-700 rounded-full" />
        )}
      </div>
      <button type="button" className="react-aria-Button" data-rac="">
        <div className="flex items-center justify-between flex-row cursor-pointer rounded-lg p-3 hover:opacity-80">
          <div className="flex items-center flex-row gap-2 undefined">
            <div className="flex flex-row relative">
              <p className="font-medium text-md undefined text-white">
                {market.replace("_", "/")}
              </p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

function formatString(input: string) {
  return input.replace(/_/g, "").toLowerCase();
}
