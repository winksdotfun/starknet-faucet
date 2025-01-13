import React, { useState } from 'react';

const App = () => {
  const [address, setAddress] = useState('');
  const [selectedToken, setSelectedToken] = useState('STRK');
  const [isValidAddress, setIsValidAddress] = useState(false);

  const validateStarknetAddress = (addr) => {
    // Basic Starknet address validation
    const starknetAddressRegex = /^0x[0-9a-fA-F]{1,64}$/;
    return starknetAddressRegex.test(addr);
  };

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    setIsValidAddress(validateStarknetAddress(newAddress));
  };

  const getTokenMessage = () => {
    return selectedToken === 'STRK' 
      ? "You can request 150 STRKs every 24 hours"
      : "You can request 0.002 ETH every 24 hours";
  };

  return (
    <div className="flex justify-center items-center min-h-screen font-mono bg-[#0C0C4F]">
      <div className="text-center">
        <p className="text-2xl font-bold text-[#FAFAFA] mb-2">Get testnet tokens</p>
        <p className="text-sm text-[#FAFAFA]/80 mb-4">
          Enter your Starknet address and select the token you want to receive
        </p>
        <div className="sm:w-[300px] md:w-[500px] border-2 border-[#E6778B] rounded-lg mx-auto p-6 bg-[#FAFAFA]">
          <div className="text-start mb-6">
            <p className="text-[#0C0C4F] font-semibold mb-2">Starknet Address</p>
            <input 
              type="text" 
              placeholder="0x..." 
              value={address}
              onChange={handleAddressChange}
              className="border-2 border-[#0C0C4F]/20 w-full p-2 px-3 outline-none rounded bg-[#FAFAFA] text-[#0C0C4F] placeholder-[#0C0C4F]/40 focus:border-[#E6778B] transition-colors"
            />
            {address && !isValidAddress && (
              <p className="text-[#E6778B] text-sm mt-1">Please enter a valid Starknet address</p>
            )}
          </div>
          
          <div className="text-start mb-6">
            <p className="text-[#0C0C4F] font-semibold mb-2">Select token</p>
            <div className="flex gap-5">
              <button 
                onClick={() => setSelectedToken('STRK')}
                className={`p-2 w-full rounded transition-colors ${
                  selectedToken === 'STRK'
                    ? 'bg-[#E6778B] text-[#FAFAFA] border-2 border-[#E6778B]'
                    : 'border-2 border-[#0C0C4F]/20 text-[#0C0C4F] hover:border-[#E6778B]'
                }`}
              >
                STRK
              </button>
              <button 
                onClick={() => setSelectedToken('ETH')}
                className={`p-2 w-full rounded transition-colors ${
                  selectedToken === 'ETH'
                    ? 'bg-[#E6778B] text-[#FAFAFA] border-2 border-[#E6778B]'
                    : 'border-2 border-[#0C0C4F]/20 text-[#0C0C4F] hover:border-[#E6778B]'
                }`}
              >
                ETH
              </button>
            </div>
          </div>

          <p className="text-sm text-[#0C0C4F]/70 mb-6">{getTokenMessage()}</p>

          <button 
            disabled={!isValidAddress}
            className={`w-full p-3 rounded font-semibold transition-colors ${
              isValidAddress
                ? 'bg-[#E6778B] hover:bg-[#E6778B]/90 text-[#FAFAFA]'
                : 'bg-[#0C0C4F]/10 text-[#0C0C4F]/40 cursor-not-allowed'
            }`}
          >
            Request Tokens
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;