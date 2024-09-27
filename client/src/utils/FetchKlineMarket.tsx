import axios from "axios";
import { getKlines, getTickers } from "./httpClient";

const markets = ['BTC_USDC', 'ETH_USDC', 'SOL_USDC', 'USDT_USDC', 'LINK_USDC', 'UNI_USDC', 'PEPE_USDC'];
const interval = "1h";
const startTime = Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 7) / 1000)
const endTime = Math.floor(new Date().getTime() / 1000);

export async function fetchKlinesMarket() {
    try {
        const fetchPromises = markets.map(market => getKlines(market, interval, startTime, endTime));
        const results = await Promise.all(fetchPromises);
        return results;
    } catch (error) {   
        console.error("Error while fetching the klines data: ", error);
    }
}

export async function getTickersKline () {
    try {
        const targetSymbols = await axios.get("https://price-indexer.workers.madlads.com/?ids=solana,bitcoin,ethereum,chainlink,uniswap,pepe")
        return targetSymbols.data;
        
    } catch (error) {
        
    }
}