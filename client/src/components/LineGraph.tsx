import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import 'chart.js/auto';

interface PriceData {
  closeTime: number;
  closePrice: number;
}

const CoinChart = ({ symbol }: { symbol: string }) => {
  const [priceData, setPriceData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [borderColor, setBorderColor] = useState<string>("rgba(75,192,192,1)"); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<PriceData[]>(
          `https://api.binance.com/api/v3/klines`,
          {
            params: {
              symbol: symbol.toUpperCase(),
              interval: '1d', 
              limit: 7,
            },
          }
        );

        const prices = response.data.map((data: any) => parseFloat(data[4]));
        const labels = response.data.map((data: any) =>
          new Date(data[6]).toLocaleDateString()
        );

        setPriceData(prices);
        setLabels(labels);

        
        const firstPrice = prices[0];
        const lastPrice = prices[prices.length - 1];
        const color = lastPrice > firstPrice ? "green" : "red";
        setBorderColor(color);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [symbol]);

  const data = {
    labels,
    datasets: [
      {
        label: "Price (USD)",
        data: priceData,
        fill: false,
        borderColor: borderColor,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, 
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => `Price: $${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
    elements: {
      line: {
        backgroundColor: 'transparent', // Transparent background for line
      },
      point: {
        backgroundColor: 'transparent', // Transparent background for points
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      },
    },
  };

  return (
    <div style={{ backgroundColor: 'transparent' }}> {/* White background for the container */}
      <Line data={data} options={options} />
    </div>
  );
};

export default CoinChart;
