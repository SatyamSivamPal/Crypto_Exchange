import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

interface LineChartComponentProps {
  data: { priceChange24h: number }[];
  width?: number;
  height?: number;
}

const getLineColor = (data: { priceChange24h: number }[]): string => {
  if (data.length < 2) return "#00c278";

  const initialPrice = data[0].priceChange24h;
  const currentPrice = data[data.length - 1].priceChange24h;

  return currentPrice > initialPrice ? "#00c278" : "#f44336";
};

const LineChartComponent: React.FC<LineChartComponentProps> = ({
  data,
  width = 50,
  height = 80,
}) => {
  const minValue = Math.min(...data.map((d) => d.priceChange24h));
  const maxValue = Math.max(...data.map((d) => d.priceChange24h));

  return (
    <LineChart
      width={width}
      height={height}
      data={data}
      style={{ backgroundColor: "transparent" }}
    >
      <CartesianGrid stroke="none" />
      <XAxis tick={false} axisLine={false} />
      <YAxis
        domain={[
          minValue - (maxValue - minValue) * 0.1,
          maxValue + (maxValue - minValue) * 0.1,
        ]}
        tickCount={5}
        tickFormatter={(tick) => `$${tick.toFixed(2)}`}
        stroke="none"
      />
      <Line
        type="monotone"
        dataKey="priceChange24h"
        stroke={getLineColor(data)}
        strokeWidth={2}
        dot={false}
      />
    </LineChart>
  );
};

export default LineChartComponent;
