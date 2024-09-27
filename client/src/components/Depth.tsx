import { useEffect, useState } from "react";
import { BidTable } from "./BidTable";
import { AskTable } from "./AskTable";
import WebSocketManager from "../utils/depthRealtime"
import { Depth as DepthType } from '../utils/type';

export function Depth({ market }: {market: string}) {
    const [bids, setBids] = useState<[string, string][]>();
    const [asks, setAsks] = useState<[string, string][]>();
    const [price, setPrice] = useState<string>();
    const [depthData, setDepthData] = useState<DepthType | null>(null);

    useEffect(() => {
        const Market = formatString(market);
        WebSocketManager.subscribe(Market);
        const handleDepthUpdate = (data: DepthType | null) => {
            if (data) {
                setDepthData(data);
                setBids(data.b);
                setAsks(data.a);
            }
        }
        WebSocketManager.addSubscriber(handleDepthUpdate);
        return () => {
            WebSocketManager.removeSubscriber(handleDepthUpdate);
            WebSocketManager.unsubscribe();
        }

    }, [market]); // Ensure useEffect runs only when market changes

    return <div className="w-full h-full pr-4">
        <TableHeader />
        {asks && <AskTable asks={asks} />}
        {price && <div className="text-white font-bold">{price}</div>}
        {bids && <BidTable bids={bids} />}
    </div>
}

function TableHeader() {
    return <div className="flex justify-between pb-1">
    <div className="text-white font-medium ml-5">Price</div>
    <div className="text-slate-500">Size</div>
    <div className="text-slate-500">Total</div>
</div>
}

function formatString(input: string) {
    return input.replace(/_/g, "").toLowerCase();
  }