export const CREATE_ORDER = "CREATE_ORDER";
export const CANCEL_ORDER = "CANCEL_ORDER";
export const ON_RAMP = "ON_RAMP";
export const GET_DEPTH = "GET_DEPTH";
export const GET_OPEN_ORDERS = "GET_OPEN_ORDERS";

type createOrder = {
    market: string,
    price: string,
    quantity: string,
    userId: string,
    side: "buy" | "sell"
}

type cancelOrder = {
    orderId: string,
    market: string
}

type onRamp = {
    amount: string,
    userId: string,
    txnId: string
}

type getDepth = {
    market: string
}

type getOpenOrders = {
    userId: string,
    market: string
}

export type MessageFromApi = 
    | { type: typeof CREATE_ORDER; data: createOrder }
    | { type: typeof CANCEL_ORDER; data: cancelOrder }
    | { type: typeof ON_RAMP; data: onRamp }
    | { type: typeof GET_DEPTH; data: getDepth }
    | { type: typeof GET_OPEN_ORDERS; data: getOpenOrders };