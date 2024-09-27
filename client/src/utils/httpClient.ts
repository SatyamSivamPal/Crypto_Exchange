import axios from "axios";
import { Depth, KLine, Ticker, Trade } from "./type";

const BASE_URL = "https://exchange-proxy.100xdevs.com/api/v1";

export async function getTicker(market: string): Promise<Ticker> {
  const tickers = await getTickers();
  const ticker = tickers.find((t) => t.symbol === market);
  if (!ticker) {
    throw new Error(`No ticker found for ${market}`);
  }
  return ticker;
}

export async function getTickers(): Promise<Ticker[]> {
  const res = await axios.get(`${BASE_URL}/tickers`);
  return res.data;
}

export async function getDepth(market: string): Promise<Depth> {
  const response = await axios.get(`${BASE_URL}/depth?symbol=${market}`);
  return response.data;
}
export async function getTrades(market: string): Promise<Trade[]> {
  const response = await axios.get(`${BASE_URL}/trades?symbol=${market}`);
  return response.data;
}

export async function getKlines(
  market: string,
  interval: string,
  startTime: number,
  endTime: number
): Promise<KLine[]> {
  const response = await axios.get(
    `${BASE_URL}/klines?symbol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`
  );
  const data: KLine[] = response.data;
  return data.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}

export async function getMarkets(): Promise<string[]> {
  const response = await axios.get(`${BASE_URL}/markets`);
  return response.data;
}

export async function getPriceChange(market: string) {
  const options = {
    method: 'GET',
    url: `https://api.coingecko.com/api/v3/coins/${market}/market_chart/range`,
    params: {vs_currency: 'usd', from: '1711929600', to: '1712275200'},
    headers: {accept: 'application/json', 'x-cg-demo-api-key': 'CG-GYvmu4TtjA9pR15wHw4JB8kW'}
  };
  
  const res = await axios.request(options);
  return res.data.prices;
}

export async function TopGainers() {
  const response = await axios.get(
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
    {
      headers: {
        "X-CMC_PRO_API_KEY":"aed4c3f6-40b8-4a22-b9c5-111617e59a03",
      },
      params:{
        start: 1,
        limit: 5,
        sort: "percent_change_24h", 
        sort_dir: "desc", 
        convert: "USD",
      }
    }
  )
  return response.data.data;
}

export async function PopularCoins () {
  const response = await axios.get(
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
    {
      headers: {
        "X-CMC_PRO_API_KEY": "aed4c3f6-40b8-4a22-b9c5-111617e59a03", // Replace with your API key
      },
      params: {
        start: 1,
        limit: 5, // Number of popular coins to fetch
        sort: "market_cap",
        sort_dir: "desc",
        convert: "USD",
      },
    }
  );
  return response.data.data;
}

export async function New() {
  const response  = await axios.get(
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
    {
      headers: {
        "X-CMC_PRO_API_KEY": "aed4c3f6-40b8-4a22-b9c5-111617e59a03", // Replace with your API key
      },
      params: {
        start: 1,
        limit: 5, // Number of new coins to fetch
        sort: "date_added",
        sort_dir: "desc",
        convert: "USD",
      },
    }
  );
  return response.data.data;
}