import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrimaryButton, RewardButton, SuccessButton } from "./button";
import QRcode from "react-qr-code"
import QRCode from "react-qr-code";


export const AfterSignin = () => {
  const navigate = useNavigate();
  const [showDepositCard, setShowDepositCard] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(""); // For Asset dropdown
  const [assetAddress, setAssetAddress] = useState(""); // Asset address
  const [qrValue, setQrValue] = useState(""); // QR code value
  const [selectedBrop, setSelectedBrop] = useState(""); // For Brop dropdown




  const goToWallet = () => {
    navigate("/wallet/balances");
  };

  function deposit() {
    setShowDepositCard(true); // Show the deposit card
  }

  function withdraw() {
    // Handle withdraw logic here
  }

  function rewards() {
    // Handle rewards logic here
  }

  const closeCard = () => {
    setShowDepositCard(false); // Close the deposit card
  };

  const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const asset = e.target.value;
    setSelectedAsset(asset);

    const handleBropChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedBrop(e.target.value); // Handle brop dropdown change
    };

    // Generate address and QR code based on the selected asset
    let address = "";
    let qrCodeValue = "";

    switch (asset) {
      case "bitcoin":
        address = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";
        qrCodeValue = `bitcoin:${address}`;
        break;
      case "ethereum":
        address = "0x32Be343B94f860124dC4fEe278FDCBD38C102D88";
        qrCodeValue = `ethereum:${address}`;
        break;
      case "usdt":
        address = "1N52wHoVR79PMDishab2XmRHsbekCdGquK";
        qrCodeValue = `usdt:${address}`;
        break;
      case "bnb":
        address = "bnb1u7szlkr37wjc5yzdjf0vqsz5wpfw4am8g9ymsk";
        qrCodeValue = `bnb:${address}`;
        break;
      default:
        address = "";
        qrCodeValue = "";
    }

    setAssetAddress(address);
    setQrValue(qrCodeValue);
  };

  return (
    <div className={`relative ${showDepositCard ? "blur-background" : ""}`}>
      <div className="flex items-center">
        <div className="p-2 mr-2">
          <SuccessButton onClick={deposit}>Deposit</SuccessButton>
          <PrimaryButton onClick={withdraw}>Withdraw</PrimaryButton>
          <RewardButton onClick={rewards}>Rewards</RewardButton>
        </div>
        <div
          className="text-slate-300 pl-6 hover:cursor-pointer"
          onClick={goToWallet}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
            />
          </svg>
        </div>
        <div className="flex items-center justify-center pl-5">
          <div className="w-8 h-8 flex items-center justify-center bg-slate-700 text-white text-xl font-bold rounded-full cursor-pointer">
            A
          </div>
        </div>
      </div>

      {/* Deposit card */}
      {showDepositCard && (
        <div className="fixed inset-0 flex items-center justify-center z-50 font-roboto">
        <div className="absolute inset-0 backdrop-blur-sm bg-opacity-90" onClick={closeCard}></div>
        <div className="bg-baseBackgroundL3 p-9 w-96 rounded-lg z-10">
          <h2 className="text-3xl font-bold mb-2 flex justify-center bg-transparent">Deposit</h2>
      
          {/* Asset Dropdown */}
          <div className="mb-4 bg-transparent">
            <label htmlFor="asset" className="block text-sm font-medium text-gray-500 bg-transparent">
              Asset
            </label>
            <select
              id="asset"
              value={selectedAsset}
              onChange={handleAssetChange}
              className="mt-1 block w-full p-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="bitcoin">Bitcoin</option>
              <option value="ethereum">Ethereum</option>
              <option value="usdt">USDT</option>
              <option value="bnb">BNB</option>
              <option value="sol">SOL</option>
            </select>
          </div>
      
          <div className="mb-4 bg-transparent">
            <label htmlFor="brop" className="block text-sm font-medium text-gray-500 bg-transparent">
              Network
            </label>
            <select
              id="brop"
              value={selectedBrop}
              className="mt-1 block w-full p-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="bitcoin">Bitcoin</option>
              <option value="ethereum">Ethereum</option>
              <option value="solana">Solana</option>
              <option value="ton">TON</option>
              {/* Add more options as needed */}
            </select>
          </div>
      
          {/* Display QR code and address for the selected asset */}
          {selectedAsset && (
            <div className="mb-4 bg-transparent">
              <div className="mt-4 bg-transparent flex items-center justify-center p-2">
                <QRCode value={qrValue} size={100} />
              </div>
      
              {/* Centered and split address */}
              <div className="text-center  font-roboto mt-4 rounded-xl p-1">
                <p className="bg-transparent">{assetAddress.slice(0, assetAddress.length / 2)}</p>
                <p className="bg-transparent">{assetAddress.slice(assetAddress.length / 2)}</p>
              </div>
            </div>
          )}
      
          {/* Caution box */}
          <div className="mt-2 p-2 border border-baseBackgroundL3 text-xs font-roboto text-gray-600 text-center rounded-xl">
            `This address is for SOL on Solana only. Do not send any other crypto, or it may be lost and unretrievable.`
          </div>
      
          <button className="mt-4 p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600" onClick={closeCard}>
            Copy Address
          </button>
        </div>
      </div>
      )}
    </div>
  );
};
