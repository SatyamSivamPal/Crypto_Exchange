import React, { useEffect, useRef, memo } from "react";

interface TradingViewWidgetProps {
  symbol: string;
  interval?: string;
  theme?: "light" | "dark";
  autosize?: boolean;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbol,
  interval = "D",
  theme = "dark",
  autosize = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize,
        symbol,
        interval,
        timezone: "Etc/UTC",
        theme,
        style: "1",
        locale: "en",
        withdateranges: false,
        hide_side_toolbar: true,
        backgroundColor: "rgb(14,15,20)",
        allow_symbol_change: true,
        support_host: "https://www.tradingview.com",
      });
      container.appendChild(script);

      return () => {
        container.innerHTML = "";
      };
    }
  }, [symbol, interval, theme, autosize]);

  return (
    <div className="tradingview-widget-container" ref={containerRef} style={{ height: "100%", width: "100%" }} >
      <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}> </div>
    </div>
  );
};

export default memo(TradingViewWidget);
