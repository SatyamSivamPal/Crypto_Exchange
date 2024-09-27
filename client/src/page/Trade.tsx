import { useParams } from "react-router-dom";
import MarketBar from "../components/MarketBar";
import { TradeView } from "../components/TradeView";
import { Depth } from "../components/Depth";
import { SwapUI } from "../components/SwapUi";
import { useState } from "react";
import Table from "../components/Table";

const Trade = () => {
  const { market } = useParams();
  const [activeTab, setActiveTab] = useState<"spot" | "favorite">("spot");

  const handleTabClick = (tab: "spot" | "favorite") => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="flex flex-row h-full">
        <div className="flex flex-col flex-1">
          <MarketBar market={market as string} />
          <div className="flex flex-row flex-1 border-y border-slate-800">
            <div className="flex flex-col flex-1">
              <TradeView market={market as string} />
            </div>
            <div className="flex flex-col w-[500px] border-l border-slate-800">
              <Depth market={market as string} />
            </div>
          </div>
        </div>
        <div className="w-[300px] border-l border-slate-800">
          <SwapUI market={market as string} />
        </div>
      </div>
      <div className="absolute -left-[-610px] mt-12">
        <div className="w-full flex flex-row">
          <div
            className={`flex-1 px-8 py-1 rounded-lg text-center font-bold cursor-pointer text-lg ${
              activeTab === "spot"
                ? "bg-blue-500  text-blue-100"
                : "text-gray-400"
            }`}
            onClick={() => handleTabClick("spot")}
          >
            Spot
          </div>
          <div
            className={`flex-1 ml-2 px-8 py-1 rounded-lg text-center font-bold cursor-pointer ${
              activeTab === "favorite"
                ? " bg-blue-500  text-blue-100"
                : "text-gray-400"
            }`}
            onClick={() => handleTabClick("favorite")}
          >
            Favorite
          </div>
        </div>
      </div>
      <div className="relative top-[120px] w-[1100px] left-[630px]">
            <Table />
      </div>
    </div>
  );
};

export default Trade;
