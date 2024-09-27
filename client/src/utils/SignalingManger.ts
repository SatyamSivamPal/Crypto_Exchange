import { Ticker } from "./type";

export const BASE_URL = "wss://ws.backpack.exchange/"

export class SignalingManager {
    private ws: WebSocket;
    private static instance: SignalingManager;
    private bufferedMessages: any[] = [];
    private callbacks: { [type: string] : any [] } = {};
    private id: number;
    private initialized: boolean = false;

    private constructor () {
        this.ws = new WebSocket(BASE_URL);
        this.bufferedMessages = [];
        this.id = 1;
        this.init();
    }

    public static getInstance(){
        if(!this.instance) {
            this.instance = new SignalingManager()
        }
        return this.instance;
    }

    init() {
        this.ws.onopen = () => {
            this.initialized = true;
            this.bufferedMessages.forEach(msg => {
                this.ws.send(JSON.stringify(msg));
            })
            this.bufferedMessages = [];
        }

        this.ws.onmessage = (e) => {
            const msg = JSON.parse(e.data);
            const type = msg.data.e;

            if(this.callbacks[type]) {
                this.callbacks[type].forEach(({ callback }) => {
                    if(type === "ticker") {
                        const newTicker: Partial<Ticker> = {
                            lastPrice: msg.data.c,
                            high: msg.data.h,
                            low: msg.data.l,
                            volume: msg.data.v,
                            quoteVolume: msg.data.V,
                            symbol: msg.data.s
                        }
                        callback(newTicker)
                    }
                })
            }
        }
    }

    sendMessage(message: any){
        const messageToSend = {
            ...message,
            id: this.id++
        }
        if(!this.initialized){
            this.bufferedMessages.push(messageToSend);
            return;
        }
        this.ws.send(JSON.stringify(messageToSend));
    }

    async registerCallback(type: string, callback: any, id:string) {
        this.callbacks[type] = this.callbacks[type] || [];
        this.callbacks[type].push({callback, id});
    }

    async deRegisterCallback (type: string, id: string) {
        if(this.callbacks[type]){
            const index = this.callbacks[type].findIndex(callback => callback.id === id);
            if(!index){
                this.callbacks[type].splice(index, 1);
            }
        }
    }
}