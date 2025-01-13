import React, { useState } from 'react';

const App = () => {
  const [address, setAddress] = useState('');
  const [selectedToken, setSelectedToken] = useState('STRK');
  const [isValidAddress, setIsValidAddress] = useState(false);

  const validateStarknetAddress = (addr) => {
    const starknetAddressRegex = /^0x[0-9a-fA-F]{1,64}$/;
    return starknetAddressRegex.test(addr);
  };

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    setIsValidAddress(validateStarknetAddress(newAddress));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0C0C4F] to-[#0C0C4F]/90 text-[#FAFAFA] font-mono">
      <div className="sm:w-[300px] md:w-[500px] px-4">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#E6778B] to-[#FAFAFA]">
            Starknet Faucet
          </h1>
          <p className="text-[#FAFAFA]/70">
            Get testnet tokens for your Starknet journey
          </p>
        </div>

        <div className="backdrop-blur-sm bg-[#FAFAFA]/5 rounded-2xl p-6 shadow-xl border border-[#FAFAFA]/10">
          {/* Address Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-[#FAFAFA]">
              Starknet Address
            </label>
            <input 
              type="text" 
              placeholder="0x..." 
              value={address}
              onChange={handleAddressChange}
              className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA]/10 border border-[#FAFAFA]/20 
                       text-[#FAFAFA] placeholder-[#FAFAFA]/30 outline-none focus:border-[#E6778B] 
                       transition-all duration-300"
            />
            {address && !isValidAddress && (
              <p className="mt-2 text-sm text-[#E6778B]">Please enter a valid Starknet address</p>
            )}
          </div>

          {/* Token Selection */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-2 text-[#FAFAFA]">
              Select Token
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setSelectedToken('STRK')}
                className={`px-4 py-3 rounded-xl transition-all duration-300 
                  ${selectedToken === 'STRK' 
                    ? 'bg-[#E6778B] text-[#FAFAFA] shadow-lg' 
                    : 'bg-[#FAFAFA]/10 hover:bg-[#FAFAFA]/20 border border-[#FAFAFA]/20'
                  }`}
              >
                STRK
              </button>
              <button 
                onClick={() => setSelectedToken('ETH')}
                className={`px-4 py-3 rounded-xl transition-all duration-300 
                  ${selectedToken === 'ETH' 
                    ? 'bg-[#E6778B] text-[#FAFAFA] shadow-lg' 
                    : 'bg-[#FAFAFA]/10 hover:bg-[#FAFAFA]/20 border border-[#FAFAFA]/20'
                  }`}
              >
                ETH
              </button>
            </div>

            <div className="mt-4 text-center text-sm text-[#FAFAFA]/70 bg-[#FAFAFA]/5 rounded-xl p-3">
              {selectedToken === 'STRK' 
                ? "You can request 150 STRKs every 24 hours"
                : "You can request 0.002 ETH every 24 hours"
              }
            </div>
          </div>

          {/* Request Button */}
          <button 
            disabled={!isValidAddress}
            className={`w-full py-4 rounded-xl font-medium transition-all duration-300
              ${isValidAddress 
                ? 'bg-gradient-to-r from-[#E6778B] to-[#E6778B]/80 hover:opacity-90 shadow-lg' 
                : 'bg-[#FAFAFA]/10 text-[#FAFAFA]/40 cursor-not-allowed'
              }`}
          >
            Request Tokens
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-[#FAFAFA]/50">
          Powered by winks.fun
        </div>
      </div>
    </div>
  );
};

export default App;