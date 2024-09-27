import { Ticker as TickerType } from "./type";

type Ticker = TickerType;

class WebSocketManager {
    private static instance: WebSocketManager;
    private ws: WebSocket | null = null;
    private TickerData: Ticker | null = null;
    private subscribers: Array<(data: Ticker | null) => void> = [];

    private constructor() {}

    public static getInstance(): WebSocketManager {
        if (!WebSocketManager.instance) {
            WebSocketManager.instance = new WebSocketManager();
        }
        return WebSocketManager.instance;
    }

    public subscribe(market: string): void {
        if (this.ws) {
            this.ws.close();
        }

        // Binance WebSocket endpoint for depth data
        this.ws = new WebSocket(`wss://stream.binance.com/ws/${market}@ticker`);
        this.ws.onopen = () => {
            console.log("WebSocket connection opened for Ticker data");
        };

        this.ws.onmessage = (event: MessageEvent) => {
            try {
               const data = JSON.parse(event.data);
               
               const tickerData: Ticker = {
                openPrice: data.o,
                lastPrice: data.c,
                highPrice: data.h,
                lowPrice: data.l,
                volume: data.v,
                quoteVolume: data.q,
                priceChange: data.p,
                priceChangePercent: data.P,
                symbol: data.s
               }
                this.TickerData = tickerData;
                this.notifySubscribers();
            } catch (error) {
                console.error("Error parsing WebSocket data:", error);
            }
        };

        this.ws.onerror = (error: Event) => {
            console.log("WebSocket error:", error);
        };

        this.ws.onclose = () => {
            console.log("WebSocket connection closed");
        };
    }

    public unsubscribe(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    public getData(): Ticker | null {
        return this.TickerData;
    }

    public addSubscriber(callback: (data: Ticker | null) => void): void {
        this.subscribers.push(callback);
    }

    public removeSubscriber(callback: (data: Ticker | null) => void): void {
        this.subscribers = this.subscribers.filter(cb => cb !== callback);
    }

    private notifySubscribers(): void {
        this.subscribers.forEach(callback => callback(this.TickerData));
    }
}

const instance = WebSocketManager.getInstance();
export default instance;
