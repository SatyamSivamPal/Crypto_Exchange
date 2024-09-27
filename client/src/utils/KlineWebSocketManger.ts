import { KLine as klineType } from "./type";

type KLine = klineType

class WebSocketManager {
    private static instance: WebSocketManager;
    private ws: WebSocket | null = null;
    private klines: KLine[] = [];
    private subscribers: Array<(data: KLine[]) => void> = [];

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

        this.ws = new WebSocket(`wss://stream.binance.com:9443/ws/${market}@kline_5m`);

        this.ws.onopen = () => {
            console.log("Web socket connection opened");
        };

        this.ws.onmessage = (event: MessageEvent) => {
            const data: KLine[] = JSON.parse(event.data); // Assuming JSON data
            this.klines = data;
            this.notifySubscribers();
        };

        this.ws.onerror = (error: Event) => {
            console.log("WebSocket error:", error);
        };
    }

    public unsubscribe(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    public getData(): KLine[] {
        return this.klines;
    }

    public addSubscriber(callback: (data: KLine[]) => void): void {
        this.subscribers.push(callback);
    }

    public removeSubscriber(callback: (data: KLine[]) => void): void {
        this.subscribers = this.subscribers.filter(cb => cb !== callback);
    }

    private notifySubscribers(): void {
        this.subscribers.forEach(callback => callback(this.klines));
    }
}

const instance = WebSocketManager.getInstance();
export default instance;
