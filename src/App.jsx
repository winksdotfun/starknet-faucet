import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [address, setAddress] = useState('');
  const [selectedToken, setSelectedToken] = useState('STRK');
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [recentlyRequested, setRecentlyRequested] = useState(false);

  const validateStarknetAddress = (addr) => {
    const starknetAddressRegex = /^0x[0-9a-fA-F]{1,64}$/;
    return starknetAddressRegex.test(addr);
  };

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    setIsValidAddress(validateStarknetAddress(newAddress));
  };

  useEffect(() => {
    if (recentlyRequested) {
      const timer = setTimeout(() => {
        setRecentlyRequested(false);
        setSuccess(null);
        setError(null);
      }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

      return () => clearTimeout(timer);
    }
  }, [recentlyRequested]);

  const requestFaucet = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('https://faucet-backend-oq96p.ondigitalocean.app/api/faucet', {
        address,
        tokenType: selectedToken
      });

      setSuccess('Tokens sent successfully!');
      setRecentlyRequested(true); // Set to true after successful request
      console.log('Faucet response:', response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          setError('You have exceeded the request limit. Please try again later (24 hour cooldown).');
          setRecentlyRequested(true); 
        }
        else if (error.response?.status === 500) {
          setError('Server error occurred. Please try again later.');
        }
        else if (error.response?.status === 403) {
          setError('You have exceeded the request limit. Please try again later (24 hour cooldown).');
          setRecentlyRequested(true); 
        }
        else {
          setError(error.response?.data?.message || 'Failed to request tokens');
        }
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0C0C4F] to-[#0C0C4F]/90 text-[#FAFAFA] font-mono">
      <div className="sm:w-[300px] md:w-[500px] px-4">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-[#E6778B] to-[#FAFAFA]">
            Starknet Faucet
          </h1>
          <p className="text-[#FAFAFA]/70">
            Get testnet tokens for your Starknet journey
          </p>
        </div>

        <div className="backdrop-blur-sm bg-[#FAFAFA]/5 rounded-2xl p-6 shadow-xl border border-[#FAFAFA]/10">
          {/* Address Input */}
          <div className="mb-2">
            <label className="block text-sm font-medium mb-2 text-[#FAFAFA]">
              Starknet Address
            </label>
            <input 
              type="text" 
              placeholder="0x..." 
              value={address}
              onChange={handleAddressChange}
              className="w-full px-4 py-2 text-sm rounded-xl bg-[#FAFAFA]/10 border border-[#FAFAFA]/20 
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
                disabled={recentlyRequested}
                className={`px-4 py-2 text-base rounded-xl transition-all duration-300 
                  ${selectedToken === 'STRK' 
                    ? 'bg-[#E6778B] text-[#FAFAFA] shadow-lg' 
                    : 'bg-[#FAFAFA]/10 hover:bg-[#FAFAFA]/20 border border-[#FAFAFA]/20'
                  } ${recentlyRequested ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                STRK
              </button>
              <button 
                onClick={() => setSelectedToken('ETH')}
                disabled={recentlyRequested}
                className={`px-4 py-2 text-base rounded-xl transition-all duration-300 
                  ${selectedToken === 'ETH' 
                    ? 'bg-[#E6778B] text-[#FAFAFA] shadow-lg' 
                    : 'bg-[#FAFAFA]/10 hover:bg-[#FAFAFA]/20 border border-[#FAFAFA]/20'
                  } ${recentlyRequested ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                ETH
              </button>
            </div>

            <div className="mt-2 text-center text-sm text-[#FAFAFA]/70 bg-[#FAFAFA]/5 rounded-xl p-3">
              {selectedToken === 'STRK' 
                ? "You can request 150 STRKs every 24 hours"
                : "You can request 0.002 ETH every 24 hours"
              }
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-2 text-xs text-[#E6778B] bg-[#E6778B]/10 rounded-xl p-3 text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-2 text-xs text-green-400 bg-green-400/10 rounded-xl p-3 text-center">
              {success}
            </div>
          )}

          {/* Request Button */}
          <button 
            onClick={requestFaucet}
            disabled={!isValidAddress || loading || recentlyRequested}
            className={`w-full py-3 rounded-xl font-medium transition-all duration-300
              ${isValidAddress && !loading && !recentlyRequested
                ? 'bg-gradient-to-r from-[#E6778B] to-[#E6778B]/80 hover:opacity-90 shadow-lg' 
                : 'bg-[#FAFAFA]/10 text-[#FAFAFA]/40 cursor-not-allowed'
              }`}
          >
            {loading ? 'Requesting...' : recentlyRequested ? 'Already Requested' : 'Request Tokens'}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-3 text-sm text-[#FAFAFA]/50">
          Powered by winks.fun
        </div>
      </div>
    </div>
  );
};

export default App;