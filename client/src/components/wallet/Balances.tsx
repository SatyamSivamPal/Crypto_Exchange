import React, { useEffect, useState } from 'react';
import WalletBalance from '../../skleton/WalletBalance';

// Define a type for the coin data
interface CoinData {
  id: string;
  name: string;
  logo: string;
  symbol: string;
}

const apiKey = 'aed4c3f6-40b8-4a22-b9c5-111617e59a03'; // Replace with your CoinMarketCap API key
const baseUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/info';

// List of coin IDs (Replace with actual IDs or symbols)
const coinIds = [
  '1',    // Bitcoin (BTC)
  '1027', // Ethereum (ETH)
  '825',  // Tether (USDT)
  '2710', // Binance Coin (BNB)
  '3408', // USD Coin (USDC)
  '52',   // XRP (XRP)
  '2010', // Cardano (ADA)
  '5426', // Solana (SOL)
  '74',   // Dogecoin (DOGE)
  '3295', // Polkadot (DOT)
  '5994', // Shiba Inu (SHIB)
  '2',    // Litecoin (LTC)
  '1975', // Chainlink (LINK)
  '7083', // Uniswap (UNI)
  '512',  // Stellar (XLM)
  '3890', // Polygon (MATIC)
  '1321', // Ethereum Classic (ETC)
  '71',   // Bitcoin Cash (BCH)
  '1958', // TRON (TRX)
  '3717', // VeChain (VET)
  '328',  // Monero (XMR)
  '1765', // EOS (EOS)
  '3794', // Cosmos (ATOM)
  '2011', // Tezos (XTZ)
  '1720', // IOTA (IOTA)
  '131',  // Dash (DASH)
  '1437', // Zcash (ZEC)
  '1518', // Maker (MKR)
  '4030', // Algorand (ALGO)
  '4558'  // Hedera (HBAR)
];

const fetchCoinData = async (ids: string[]): Promise<CoinData[]> => {
  const batchSize = 20; // Adjust based on API limits
  const batches = [];
  
  for (let i = 0; i < ids.length; i += batchSize) {
    const batchIds = ids.slice(i, i + batchSize).join(',');
    const url = `${baseUrl}?id=${batchIds}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-CMC_PRO_API_KEY': apiKey
      }
    });
    
    const data = await response.json();
    const coinData: CoinData[] = Object.values(data.data).map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      logo: coin.logo,
      symbol: coin.symbol
    }));
    
    batches.push(...coinData);
  }
  
  return batches;
};

const Balances: React.FC = () => {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCoinData = async () => {
      try {
        const coinData = await fetchCoinData(coinIds);
        setCoins(coinData);
      } catch (error) {
        console.error('Error fetching coin data:', error);
      } finally {
        setLoading(false);
      }
    };

    getCoinData();
  }, []);

  if (loading) return <div><WalletBalance /></div>;

  return (
    <div className="h-screen p-8">
      <div className="mx-auto w-full max-w-[1224px] overflow-x-auto">
        <div className="flex flex-col w-full space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-row h-12">
            <div className="flex items-center flex-row gap-6">
              <h1 className="text-3xl font-semibold text-white">Balances</h1>
            </div>
            {/* Cash Deposit Button */}
            <div>
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                Cash Deposit
              </button>
            </div>
          </div>

          {/* Column Headers */}
          <div className="grid grid-cols-5 gap-1 border-b border-gray-700 pb-2 text-white">
            <div className="font-semibold">Assets</div>
            <div className="font-semibold">Total Balance</div>
            <div className="font-semibold">Available Balance</div>
            <div className="font-semibold">USD Value</div>
            <div className="font-semibold"></div>
          </div>

          {/* Data Rows */}
          <div className="flex flex-col space-y-4">
            {coins.map((coin) => (
              <div
                key={coin.id}
                className="grid grid-cols-5 text-gray-300 gap-5 py-4 border-b border-gray-700"
              >
                <div className="gap-2 flex items-center">
                  <img src={coin.logo} alt={`${coin.name} logo`} className="w-8 h-8 "/>
                  <div className='pl-2 flex flex-col'>
                    <span className="text-center font-bold text-lg">{coin.name}</span>
                    <span className="text-gray-500">{coin.symbol}</span>
                  </div>
                </div>
                <div>0</div> {/* Replace with actual data */}
                <div>0</div> {/* Replace with actual data */}
                <div>$0.00</div> {/* Replace with actual data */}
                <div className="flex gap-2">
                  <a href="#" className="text-blue-500 font-bold">Deposit</a>
                  <a href="#" className="text-blue-500 font-bold">Withdraw</a>
                  <a href="#" className="text-blue-500 font-bold">Convert</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Balances;
