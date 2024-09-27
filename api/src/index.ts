import express from "express"
import cors from "cors"
import { orderRouter } from "./routes/Order";
import { tickersRouter } from "./routes/ticker";
import { tradesRouter } from "./routes/trade";
import { depthRouter } from "./routes/depth";

const port = 3000
const app = express()

app.use(cors());
app.use(express.json());

app.use('/api/v1/order', orderRouter);
app.use("/api/v1/depth", depthRouter);
app.use("/api/v1/trades", tradesRouter);
//app.use("/api/v1/klines", klineRouter);
app.use("/api/v1/tickers", tickersRouter);


app.listen(port, () => {
    console.log("Server running in the port "+port);
})