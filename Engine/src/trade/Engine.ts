import fs from "fs"
import { RedisManager } from "../redisManger"
import { ORDER_UPDATE, TRADE_ADDED } from "../types"
import { CANCEL_ORDER, CREATE_ORDER, GET_DEPTH, GET_OPEN_ORDERS, MessageFromApi, ON_RAMP } from "../types/fromApi"
import { Fill, Order, Orderbook } from "./OrderBook"

export const BASE_CURRENCY = "INR";

type userBalance = {
    [key: string]: {
        available: number;
        locked: number;
    }
}

export class Engine {
    private orderBook: Orderbook[] = [];
    private balances: Map<string, userBalance> = new Map();

    constructor () {
        let snapshot = null;

        try {
            if(process.env.WITH_SNAPSHOT) {
                snapshot = fs.readFileSync('./snapshot.json');
            }
        } catch (error) {
            console.log("No snapshot found"); 
        }

        if(snapshot) {
            const Snapshot = JSON.parse(snapshot.toString());
            this.orderBook = Snapshot.orderbooks.map((o: any) => new Orderbook(o.baseAsset, o.bids, o.asks, o.lastTradeId, o.currentPrice));
            this.balances = new Map(Snapshot.balances);
        } else {
            this.orderBook = [new Orderbook('TATA', [], [], 0, 0)];
            this.setBaseBalances();
        }
        setInterval(() => {
            this.saveSnapShot();
        }, 1000 * 3);
    }

    saveSnapShot () {
        const snapShot = {
            orderbooks: this.orderBook.map(o => o.getSnapshot()),
            balances: Array.from(this.balances.entries())
        }
        fs.writeFileSync("./snapshot.json", JSON.stringify(snapShot));
    }

    process({message, clientId}: {message: MessageFromApi, clientId: string}) {        
        switch(message.type){
            case CREATE_ORDER:
                try {
                    const {executedQty, fills, orderId} = this.createOrder(message.data.market, message.data.price, message.data.quantity, message.data.side, message.data.userId);
                                    
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "ORDER_PLACED",
                        payload: {
                            orderId,
                            executedQty,
                            fills
                        }
                    })

                } catch (error) {
                    console.error(error);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "ORDER_CANCELLED",
                        payload: {
                            orderId: "",
                            executedQty: 0,
                            remainingQty: 0
                        }
                    })
                }
                break;
            case CANCEL_ORDER:
                try {
                    const orderId = message.data.orderId;
                    const cancelMarket = message.data.market;

                    const cancelOrderBook = this.orderBook.find(o => o.ticker() === cancelMarket);
                    const quoteAsset = cancelMarket.split("_")[1];

                    if(!cancelOrderBook) {
                        throw new Error("No orderBook Found");
                    }

                    const order = cancelOrderBook.asks.find(o => o.orderId === orderId) || cancelOrderBook.bids.find(o => o.orderId === orderId);

                    if(!order){
                        console.log("No order found");
                        throw new Error("No order found");
                    }
                    
                    if(order.side === "buy") {
                        const price = cancelOrderBook.cancelBid(order);
                        const leftQuantity = (order.quantity - order.filled) * order.price;

                        //@ts-ignore
                        this.balances.get(order.userId)[BASE_CURRENCY].available += leftQuantity;

                        //@ts-ignore
                        this.balances.get(order.userId)[BASE_CURRENCY].locked -= leftQuantity;

                        if(price) {
                            
                        }
                    } else {
                        const price = cancelOrderBook.cancelAsk(order);
                        const leftQuantity = order.quantity - order.filled;

                        //@ts-ignore
                        this.balances.get(order.userId)[quoteAsset].available += leftQuantity;

                        //@ts-ignore
                        this.balances.get(order.userId)[quoteAsset].locked -= leftQuantity;

                        if(price) {

                        }
                    }

                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "ORDER_CANCELLED",
                        payload: {
                            orderId,
                            executedQty: 0,
                            remainingQty: 0
                        }
                    })

                } catch (error) {
                    console.log("Error while cancelling order", error);
                }
                break;

            case GET_OPEN_ORDERS:
                try {
                    const openOrderBook = this.orderBook.find(o => o.ticker() === message.data.market);
                    if(!openOrderBook) {
                        throw new Error("No Orderbook found");
                    }
                    const openOrders = openOrderBook.getOpenOrders(message.data.userId);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "OPEN_ORDERS",
                        payload: openOrders
                    })
                } catch (error) {
                    console.log(error);
                }
                break;

            case ON_RAMP:
                try {
                    const userId = message.data.userId;
                    const amount = Number(message.data.amount);
                    this.onRamp(userId, amount)
                } catch (error) {
                    console.log(error);
                }
                break;
            
            case GET_DEPTH:
                try {
                    const market = message.data.market;
                    const orderBook = this.orderBook.find(o => o.ticker() === market);

                    if(!orderBook) {
                        throw new Error("No OrderBook found");
                    }
                    RedisManager.getInstance().sendToApi(clientId, {
                        type:"DEPTH",
                        payload: orderBook.getDepth()
                    })
                } catch (error) {
                    console.log(error);
                    RedisManager.getInstance().sendToApi(clientId, {
                        type: "DEPTH",
                        payload: {
                            bids: [],
                            asks: []
                        }
                    })
                }
                break;
        }

    }

    createOrder(market: string, price: string, quantity: string, side: "buy" | "sell", userId: string) {

        const orderBook = this.orderBook.find(o => o.ticker() === market);
        const baseAsset = market.split("_")[0];
        const quoteAsset = market.split("_")[1];                             // {base = BTC  quote = USDC}

        if(!orderBook){
            throw new Error ("No OrderBook found");
        }

        this.checkAndLockFunds(baseAsset, quoteAsset, side, userId, quoteAsset, price, quantity);

        const order: Order = {
            price: Number(price),
            quantity: Number(quantity),
            orderId: Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2,15),
            filled: 0,
            side,
            userId
        }

        const {fills, executedQty} = orderBook.addOrder(order);

        this.updateBalance(userId, baseAsset, quoteAsset, side, fills, executedQty);



        return {executedQty, fills, orderId: order.orderId};

    }
    
    updateBalance(userId: string, baseAsset: string, quoteAsset: string, side: "buy" | "sell", fills: Fill[], executedQty: number) {
        if(side === "buy") {
            fills.forEach(fill => {

                //update quote asset Balance
                //@ts-ignore
                this.balances.get(fill.otherUserId)[quoteAsset].available = this.balances.get(fill.otherUserId)?.[quoteAsset].available + (fill.quantity * fill.price);
                
                //@ts-ignore
                this.balances.get(userId)[quoteAsset].locked = this.balances.get(userId)[quoteAsset].locked - (fill.quantity * fill.price);

                //update base asset balance
                //@ts-ignore
                this.balances.get(fill.otherUserId)[baseAsset].locked = this.balances.get(fill.otherUserId)[baseAsset].locked - fill.quantity;

                //@ts-ignore
                this.balances.get(userId)[baseAsset].available = this.balances.get(userId)[baseAsset].available + fill.quantity
            })
        } else {
            fills.forEach(fill => {

                //update quote asset Balance
                //@ts-ignore
                this.balances.get(fill.otherUserId)[quoteAsset].locked = this.balances.get(fill.otherUserId)[quoteAsset].locked - (fill.quantity * fill.price);

                //@ts-ignore
                this.balances.get(userId)[quoteAsset].available = this.balances.get(userId)[quoteAsset].available + (fill.quantity * fill.price);

                //update base asset Balances
                //@ts-ignore
                this.balances.get(fill.otherUserId)[baseAsset].available = this.balances.get(fill.otherUserId)[baseAsset].available + (fill.quantity);

                //@ts-ignore
                this.balances.get(userId)[baseAsset].locked = this.balances.get(userId).locked - (fill.quantity)
            })
        }
    }

    checkAndLockFunds (baseAsset: string, quoteAsset: string, side: "buy" | "sell", userId: string, asset: string, price: string, quantity: string) {
        if(side == "buy") {
            if( (this.balances.get(userId)?.[quoteAsset]?.available || 0) < Number(quantity) * Number(price) ) {
                throw new Error("Insufficent Funds");
            }

            //@ts-ignore {Available decreases}
            this.balances.get(userId)[quoteAsset].available = this.balances.get(userId)?.[quoteAsset].available - ( Number(quantity) * Number(price) );
            
            //@ts-ignore {Locked Increase}
            this.balances.get(userId)[quoteAsset].locked = this.balances.get(userId)?.[quoteAsset].locked + ( Number(quantity) * Number(price) );
        } else {
            if( (this.balances.get(userId)?.[baseAsset]?.available || 0) < Number(quantity) ) {
                throw new Error ("Insufficent Funds");
            }

            //@ts-ignore   {Available decreases}
            this.balances.get(userId)[baseAsset].available = this.balances.get(userId)[baseAsset].available - (Number(quantity));

            //@ts-ignore   {Locked Increase}
            this.balances.get(userId)[baseAsset].locked = this.balances.get(userId)[baseAsset].locked + Number(quantity);
        }
    }

    onRamp (userId: string, amount: number) {
        const userBalance = this.balances.get(userId);
        if(!userBalance) {
            this.balances.set(userId, {
                [BASE_CURRENCY]: {
                    available: amount,
                    locked: 0
                }
            })
        } else {
            userBalance[BASE_CURRENCY].available += amount;
        }
    }

    setBaseBalances () {
        this.balances.set("1", {
            [BASE_CURRENCY]: {
                available: 100000,
                locked: 0
            },
            "TATA": {
                available: 100000,
                locked: 0
            }
        })

        this.balances.set("2", {
            [BASE_CURRENCY] : {
                available: 100000,
                locked: 0
            }, 
            "TATA": {
                available:100000,
                locked: 0
            }
        })

        this.balances.set("3", {
            [BASE_CURRENCY]: {
                available: 1000000,
                locked: 0
            },
            "TATA" : {
                available: 1000000,
                locked: 0
            }
        })
    }
}

