import { Outlet } from 'react-router-dom';
import PortfolioHeader from "../components/wallet/PortfolioHeader";

const PortfolioLayout = () => {
  return (
    <div>
      <div className="w-full h-full flex-1 flex-col">
        <PortfolioHeader />
      </div>
      <div className="w-full flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default PortfolioLayout;
 