import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {AfterSignin} from "./AfterSignin"
import { BeforeSignin } from "./BeforeSignin";
import MarketSearch from "./Search";

const Appbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;

  const handleLogoClick = () => {
    navigate("/");
  };

  const [selectedMarket, setSelectedMarket] = useState("BTC_USDT");

  const handleMarketSelect = (market: string) => {
    setSelectedMarket(market);
  };

  return (
    <div className="border-b text-white border-slate-800">
      <div className="flex justify-between items-center p-3">
        <div className="flex items-center">
          <div
            className="text-xl cursor-pointer pl-8 font-bold font-roboto text-red-500"
            onClick={handleLogoClick}
          >
            <p className="bg-transparent">
                <span className="text-white bg-transparent font-extrabold text-2xl">X</span>change
              </p>
          </div>
          <div
            className={`text-md pt-1 pl-8 cursor-pointer font-roboto ${
              pathName === "/" || pathName.startsWith("/market")
                ? "text-white"
                : "text-slate-500"
            }`}
            onClick={() => navigate("/")}
          >
            Markets
          </div>
          <div
            className={`text-md pt-1 pl-8 cursor-pointer font-roboto ${
              pathName.startsWith("/trade") ? "text-white" : "text-slate-500"
            }`}
            onClick={() => navigate("/trade/BTC_USDT")}
          >
            Trade
          </div>

          <div className="pl-10 relative">
            <MarketSearch onSelectMarket={handleMarketSelect} />
          </div>
        </div>
            {isUserSignedIn() ? <AfterSignin /> : <BeforeSignin />}
      </div>
    </div>
  );
};

export default Appbar;

function isUserSignedIn () {
  const token = localStorage.getItem("token");

  if(token) {
    return true;
  } else {
    return true;
  }
  
}
