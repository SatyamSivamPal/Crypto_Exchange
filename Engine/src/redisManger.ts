import { RedisClientType, createClient } from "redis";
import { WsMessage } from "./types/toWs";
import { MessageToApi } from "./types/toApi";
import { ORDER_UPDATE, TRADE_ADDED } from "./types";

type DBMessage = {
    type: typeof TRADE_ADDED,
    data: {
        id: string,
        isBuyMaker: boolean,
        price: string,
        quantity: string,
        quoteQuantity: string,
        timeStamp: number,
        market: string
    }
} | {
    type: typeof  ORDER_UPDATE,
    data: {
        orderId: string,
        executedQty: number,
        market?: string,
        price?: string,
        quantity?: string,
        side?: "buy" | "sell",
    }
}

export class RedisManager {
    private client: RedisClientType;
    private static instance: RedisManager;

    constructor () {
        this.client = createClient();
        this.client.connect();
    }

    public static getInstance () {
        if(!this.instance){
            this.instance = new RedisManager();
        }
        return this.instance;
    }

    //push into the queue before db
    public pushMessage(msg: DBMessage){
        this.client.lPush("db_processor", JSON.stringify(msg));
    }

    //publish to the pub sub with the channel
    public publishMessage(channel: string, message: WsMessage){
        this.client.publish(channel, JSON.stringify(message));
    }

    //publish to the pub sub with the client id
    public sendToApi(clientId: string, message: MessageToApi){
        this.client.publish(clientId, JSON.stringify(message));
    }
}