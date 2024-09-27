import { BrowserRouter, Route, Routes } from "react-router-dom";
import Market from "./page/Market";
import Trade from "./page/Trade";
import AppbarLayout from "./components/AppbarLayout";
import "./App.css";
import PortfolioLayout from "./page/Portfolio";
import Balances from "./components/wallet/Balances";
import Deposits from "./components/wallet/Deposits";
import Withdrawals from "./components/wallet/Withdrawals";
import Trades from "./components/wallet/Trades";
import Rewards from "./components/wallet/Rewards";
import { Signup } from "./page/Signup";
import { Login } from "./page/Login";

function App() {
  return (
    <>
      <BrowserRouter>
        <AppbarLayout>
          <Routes>
            <Route path="/wallet" element={<PortfolioLayout />}>
              <Route path="balances" element={<Balances />} />
              <Route path="deposits" element={<Deposits />} />
              <Route path="withdrawals" element={<Withdrawals />} />
              <Route path="trades" element={<Trades />} />
              <Route path="rewards" element={<Rewards />} />
            </Route>
            <Route path="/" element={<Market />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/trade/:market" element={<Trade />} />
          </Routes>
        </AppbarLayout>
      </BrowserRouter>
    </>
  );
}

export default App;
