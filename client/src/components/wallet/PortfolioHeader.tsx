import { useLocation, Link } from 'react-router-dom';

const PortfolioHeader = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="mx-auto w-full max-w-[1224px] px-8 text-white">
      <div className="text-3xl font-bold flex items-center pt-20">
        Portfolio
        <div className="flex items-center pl-2">
          <span className="text-blue-500">$0.00</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 ml-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </div>
      </div>
      {/* Navigation Menu Underneath */}
      <div className="flex space-x-10 text-xl font-roboto mt-12 text-slate-500 hover:cursor-pointer">
        <Link
          to="/wallet/balances"
          className={`hover:text-white hover:border-b-2 hover:border-white ${
            currentPath.includes('balances') ? 'text-white border-b-2 border-white' : ''
          }`}
        >
          Balance
        </Link>
        <Link
          to="/wallet/deposits"
          className={`hover:text-white hover:border-b-2 hover:border-white ${
            currentPath.includes('deposits') ? 'text-white border-b-2 border-white' : ''
          }`}
        >
          Deposits
        </Link>
        <Link
          to="/wallet/withdrawals"
          className={`hover:text-white hover:border-b-2 hover:border-white ${
            currentPath.includes('withdrawals') ? 'text-white border-b-2 border-white' : ''
          }`}
        >
          Withdrawals
        </Link>
        <Link
          to="/wallet/trades"
          className={`hover:text-white hover:border-b-2 hover:border-white ${
            currentPath.includes('trades') ? 'text-white border-b-2 border-white' : ''
          }`}
        >
          Trades
        </Link>
        <Link
          to="/wallet/rewards"
          className={`hover:text-white hover:border-b-2 hover:border-white ${
            currentPath.includes('rewards') ? 'text-white border-b-2 border-white' : ''
          }`}
        >
          Rewards
        </Link>
      </div>
    </div>
  );
};

export default PortfolioHeader;
