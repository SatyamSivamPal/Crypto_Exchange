const express = require("express");
<<<<<<< HEAD
const {createProxyMiddleware} = require("http-proxy-middleware");
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors());

const targetUrl = "https://api.backpack.exchange/api/v1";

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Expose-Headers', 'Content-Length, Content-Range');
    next();
});

app.use('/', createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
    },
    onProxyRes: (proxyRes, req, res) => {
    }
}))

const port = 3000;

app.listen(port, () =>  {
    console.log(`proxy server running on http://localhost:${port}`);
})
=======
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/new-coins", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd", // Convert to USD
          order: "market_cap_desc", // Sort by market cap
          per_page: 5, // Number of coins to fetch
          page: 1,
          sparkline: false,
        },
      }
    );
    return res.json(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/api/popular", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd", // Convert prices to USD
          order: "market_cap_desc", // Get the highest market cap coins
          per_page: 5, // Number of popular coins to fetch
          page: 1,
          sparkline: false,
        },
      }
    );
    return res.json(response.data);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/api/top", async (req, res) => {
    try {
        const response = await axios.get(
            "https://api.coingecko.com/api/v3/coins/markets",
            {
              params: {
                vs_currency: "usd", // Convert prices to USD
                order: "price_change_percentage_24h_desc", // Sort by highest price change in the last 24 hours
                per_page: 5, // Number of top gainers to fetch
                page: 1,
                sparkline: false,
              },
            }
          );
          return response.data;
    } catch (error) {
      res.status(500).send(error);
    }
  });

const PORT = 5000;
app.listen(PORT, () => {
  console.log("Server is running in the port " + PORT);
});
>>>>>>> 99d0476 (backedn update)
