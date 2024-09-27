import { createClient } from "redis";   
import { Engine } from "./trade/Engine";

async function main() {
    const engine = new Engine();
    const redisClient = createClient();

    await redisClient.connect();
    console.log("Redis Connected");

    // Poll the queue every 3 seconds
    setInterval(async () => {
        const res = await redisClient.rPop("messages" as string);
        if (!res) {

        } else {
            engine.process(JSON.parse(res));
        }
    }, 3000); 
}

main();
