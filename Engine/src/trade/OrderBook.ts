import { BASE_CURRENCY } from "./Engine";

export interface Order {
    price: number;
    quantity: number;
    orderId: string;
    filled: number;
    side: "buy" | "sell";
    userId: string;
}

export type Fill = {
    price: string;
    quantity: string;
    tradeId: string;
    otherUserId: string;
    marketOrderId: string;
}

export class Orderbook {
    bids: Order[];
    asks: Order[];
    baseAsset: string;
    quoteAsset: string = BASE_CURRENCY;
    lastTradeId: number;
    currentPrice: number;

    constructor(baseAsset: string, bids: Order[], asks: Order[], lastTradeId: number, currentPrice: number) {
        this.bids = bids;
        this.asks = asks;
        this.baseAsset = baseAsset;
        this.lastTradeId = lastTradeId || 0;
        this.currentPrice = currentPrice || 0;
    }

    ticker() {
        return `${this.baseAsset}_${this.quoteAsset}`;
    }

    getSnapshot() {
        return {
            baseAsset: this.baseAsset,
            bids: this.bids,
            asks: this.asks,
            lastTradeId: this.lastTradeId,
            currentPrice: this.currentPrice
        }
    }

    addOrder(order: Order): {
        executedQty: number,
        fills: Fill[]
    } {
        if(order.side === "buy"){
            const {executedQty, fills} = this.matchAsk(order);
            order.filled = executedQty;
            if(executedQty === order.quantity) {
                return {
                    executedQty,
                    fills
                }
            }
            this.bids.push(order);
            return  {
                executedQty,
                fills
            }
        } else {
            const {executedQty, fills} = this.matchBid(order);
            order.filled = executedQty;
            if(executedQty === order.quantity){
                return {
                    executedQty,
                    fills
                }
            }
            this.asks.push(order);
            return {
                executedQty,
                fills
            }
        }
    }

    matchAsk(order: Order): {fills: Fill[], executedQty: number} {
        const fills: Fill[] = [];
        let executedQty = 0;

        this.asks.sort();

        for(let i=0; i<this.asks.length; i++){
            if(executedQty === order.quantity){
                break;
            }

            if(this.asks[i].price <= order.price) {
                const fillQty = Math.min( (order.quantity-executedQty), this.asks[i].quantity )
                executedQty += fillQty;
                this.asks[i].filled += fillQty;
                fills.push({
                    price: this.asks[i].price.toString(),
                    quantity: fillQty.toString(),
                    tradeId: (this.lastTradeId++).toString(),
                    otherUserId: this.asks[i].userId,
                    marketOrderId: this.asks[i].orderId
                })
            }                
        }

        for(let i=0; i<this.asks.length; i++){
            if(this.asks[i].filled === this.asks[i].quantity) {
                this.asks.splice(i, 1);
                i--;
            }
        }

        return {
            fills,
            executedQty
        }
    }

    matchBid(order: Order): {fills: Fill[], executedQty: number} {
        const fills: Fill[] = [];
        let executedQty = 0;

        this.bids.sort((a,b) => b.price - a.price);

        for(let i=0; i<this.bids.length; i++){
            if(executedQty === order.quantity){
                break;
            }

            if(this.bids[i].price >= order.price){
                const amntRemaining = Math.min( (order.quantity-executedQty), this.bids[i].quantity );
                executedQty += amntRemaining;
                this.bids[i].filled += amntRemaining;
                fills.push({
                    price: this.bids[i].price.toString(),
                    quantity: amntRemaining.toString(),
                    tradeId: (this.lastTradeId++).toString(),
                    otherUserId: this.bids[i].userId,
                    marketOrderId: this.bids[i].orderId
                })
            }
        }

        for(let i=0; i<this.bids.length; i++){
            if(this.bids[i].filled === this.bids[i].quantity){
                this.bids.splice(i,1);
                i--;
            }
        }

        return {
            fills,
            executedQty
        }
    }

    getDepth() {
        //price , Quantity
        const bids: [string, string][] = [];
        const asks: [string, string][] = [];

        const bidsObj: {[key: string] : number} = {};
        const asksObj: {[key: string]: number} = {};

        for(let i = 0; i<this.bids.length; i++){
            const order = this.bids[i];

            if(!bidsObj[order.price]) {
                bidsObj[order.price] = 0;
            }
            bidsObj[order.price] += order.quantity;
        }

        for(let i = 0; i<this.asks.length; i++) {
            const order = this.asks[i];
            if(!asksObj[order.price]) {
                asksObj[order.price] = 0;
            }
            asksObj[order.price] += order.quantity;
        }

        for(const price in bidsObj) {
            bids.push([price, bidsObj[price].toString()])
        }

        for(const price in asksObj) {
            asks.push([price, asksObj[price].toString()])
        }

        return {
            asks,
            bids
        }
    }

    getOpenOrders(userId: string): Order[] {
        const asks = this.asks.filter(x => x.userId === userId);
        const bids = this.bids.filter(x => x.userId === userId);
        return [...asks, ...bids];
    }

    cancelBid(order: Order) {
        const index = this.bids.findIndex(x => x.orderId === order.orderId);
        if(index !== -1){
            const price = this.bids[index].price;
            this.bids.splice(index, 1);
            return price;
        }
    }

    cancelAsk(order: Order) {
        const index = this.asks.findIndex(x => x.orderId === order.orderId);
        if(index !== -1){
            const price = this.asks[index].price;
            this.asks.splice(index, 1);
            return price;
        }
    }
}