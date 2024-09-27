
export interface KLine {
    close: string;
    end: string;
    high: string;
    low: string;
    open: string;
    quoteVolume: string;
    start: string;
    trades: string;
    volume: string;
}


export interface Trade {
    "id": number,
    "isBuyerMaker": boolean,
    "price": string,
    "quantity": string,
    "quoteQuantity": string,
    "timestamp": number
}

export interface Depth {
    b: [string, string][],
    a: [string, string][],
    lastUpdateId: string
}

export type Ticker = {
    "openPrice": string,
    "highPrice": string,
    "lastPrice": string,
    "lowPrice": string,
    "priceChange": string,
    "priceChangePercent": string,
    "quoteVolume": string,
    "symbol": string,
    "volume": string
}

export type MarketData = {
    name: string;
    image: string;
    symbol:string;
    price_change_24h: string;
    currencies: {
        usd : {
            price: number;
            volume: number;
            market_cap: number;
            price_change_percentage_24hr: number
        }
    }
  }