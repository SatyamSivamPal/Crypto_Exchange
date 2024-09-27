import TradingViewChart from "../utils/ChartManager";

export function TradeView({ market }: { market: string }) {
  const symbol = formatString(market);
  return (
    <div className="h-full w-full">
        <TradingViewChart symbol={symbol} />
    </div>
  );
}

function formatString(input: string) {
  return input.replace(/_/g, "").toLowerCase();
}
