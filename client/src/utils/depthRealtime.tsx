import { Depth as DepthType } from "./type";

type Depth = DepthType;

class WebSocketManager {
    private static instance: WebSocketManager;
    private ws: WebSocket | null = null;
    private depthData: Depth | null = null;
    private subscribers: Array<(data: Depth | null) => void> = [];

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
        this.ws = new WebSocket(`wss://stream.binance.com/ws/${market}@depth`);

        this.ws.onopen = () => {
            console.log("WebSocket connection opened for depth data");
        };

        this.ws.onmessage = (event: MessageEvent) => {
            try {
                const data: Depth = JSON.parse(event.data);
                // Filter bids and asks to only include the top 8 items
                const filteredData: Depth = {
                    ...data,
                    b: data.b.slice(0, 12), // Top 8 bids
                    a: data.a.slice(0, 12)  // Top 8 asks
                };
                this.depthData = filteredData;
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

    public getData(): Depth | null {
        return this.depthData;
    }

    public addSubscriber(callback: (data: Depth | null) => void): void {
        this.subscribers.push(callback);
    }

    public removeSubscriber(callback: (data: Depth | null) => void): void {
        this.subscribers = this.subscribers.filter(cb => cb !== callback);
    }

    private notifySubscribers(): void {
        this.subscribers.forEach(callback => callback(this.depthData));
    }
}

const instance = WebSocketManager.getInstance();
export default instance;
