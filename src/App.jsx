import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoMdAddCircle } from 'react-icons/io';

const App = () => {
  const [address, setAddress] = useState('');
  const [selectedToken, setSelectedToken] = useState('STRK');
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const [recentlyRequested, setRecentlyRequested] = useState(false);

  const validateMonadAddress = (addr) => {
    const monadAddressRegex = /^0x[0-9a-fA-F]{40}$/;
    return monadAddressRegex.test(addr);
  };

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    setIsValidAddress(validateMonadAddress(newAddress));
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
      const response = await axios.post('https://faucet-backend-oq96p.ondigitalocean.app/api/faucet-monad', {
        address
        // tokenType: selectedToken
      });

      setSuccess('Tokens sent successfully!');
      setTransactionHash(response.data.transactionHash);
      setRecentlyRequested(true);
      console.log('Faucet response:', response.data);
      console.log('Faucet response:', response.data.transactionHash);
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

  const addNetwork = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })

        const networkParams = {
          chainId: '0x279f',
          chainName: 'Monad Testnet',
          nativeCurrency: {
            name: 'MON',
            symbol: 'MON',
            decimals: 18
          },
          rpcUrls: ['https://rpc-testnet.monadinfra.com/rpc/smkuKxR14Php4gxcWPU7ZZk5DEd9xXBU'],
          blockExplorerUrls: ['https://explorer.monad-testnet.category.xyz']
        }

        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkParams]
        })

        setSuccess('Monad Testnet added successfully!')
      } catch (error) {
        console.error('Network add failed:', error)
        setError(`Error: ${error.message}`)
      }
    } else {
      alert('MetaMask not installed')
    }
  }



  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f6f3f1] text-[#0f1324] font-mono">
      <div className="sm:w-[300px] md:w-[500px] px-4">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold mb-1 text-[#6e54ff]">
            Monad Faucet
          </h1>
          <p className="text-[#0f1324]/70">
            Get testnet tokens for your monad journey
          </p>
        </div>

        <div className="backdrop-blur-sm bg-[#fbfaf9]  rounded-2xl p-6 border border-black/10">
          {/* Address Input */}
          <div className="mb-2">
            <label className="block text-sm font-medium mb-2 text-[#0f1324]">
              Monad Address
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={address}
              onChange={handleAddressChange}
              className="w-full px-4 py-2 text-sm rounded-xl bg-[#f6f3f1] border border-[#000000]/10 
                       text-[#0f1324] placeholder-[#0f1324]/30 outline-none focus:border-[#6e54ff] 
                       transition-all duration-300"
            />
            {address && !isValidAddress && (
              <p className="mt-2 text-sm text-[#6e54ff]">Please enter a valid Monad address</p>
            )}
          </div>

          {/* Token Selection */}
          {/* <div className="mb-3">
            <label className="block text-sm font-medium mb-2 text-[#0f1324]">
              Select Token
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setSelectedToken('STRK')}
                disabled={recentlyRequested}
                className={`px-4 py-2 text-base rounded-xl transition-all duration-300 
                  ${selectedToken === 'STRK' 
                    ? 'bg-[#6e54ff] text-[#0f1324] shadow-lg' 
                    : 'bg-[#f6f3f1]/10 hover:bg-[#f6f3f1]/90 border border-[#f6f3f1]/20'
                  } ${recentlyRequested ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                MONAD
              </button>
              <button 
                onClick={() => setSelectedToken('ETH')}
                disabled={recentlyRequested}
                className={`px-4 py-2 text-base rounded-xl transition-all duration-300 
                  ${selectedToken === 'ETH' 
                    ? 'bg-[#6e54ff] text-[#0f1324] shadow-lg' 
                    : 'bg-[#f6f3f1] hover:bg-[#fbfaf9]/20 border border-[#f6f3f1]/20'
                  } ${recentlyRequested ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                ETH
              </button>
            </div>

            <div className="mt-2 text-center text-sm text-[#0f1324]/70 bg-[#fbfaf9]/5 rounded-xl p-3">
              {selectedToken === 'STRK' 
                ? "You can request 150 monad every 24 hours"
                : "You can request 0.002 ETH every 24 hours"
              }
            </div>
          </div> */}

          {/* Status Messages */}
          {error && (
            <div className="mb-2 text-xs text-[#6e54ff] bg-[#6e54ff]/10 rounded-xl p-3 text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-2 text-xs text-green-400 bg-green-400/10 rounded-xl p-3 text-center w-full truncate ">
              {success} <br /> <a href={`https://explorer.monad-testnet.category.xyz/tx/${transactionHash}`} target='_blank' rel="noopener noreferrer" className=' underline'>View txn</a>
              {transactionHash ? `${transactionHash.slice(0, 6)}...${transactionHash.slice(-4)}` : ""}
              </div>
          )}

          {/* Request Button */}
          <button
            onClick={requestFaucet}
            disabled={!isValidAddress || loading || recentlyRequested}
            className={`w-full py-3 rounded-xl font-medium transition-all duration-300
              ${isValidAddress && !loading && !recentlyRequested
                ? 'bg-gradient-to-r from-[#6e54ff] to-[#6e54ff]/80 text-[#fbfaf9] hover:opacity-90 shadow-lg'
                : 'bg-[#0f1324]/10 text-[#0f1324]/40 cursor-not-allowed'
              }`}
          >
            {loading ? 'Requesting...' : recentlyRequested ? 'Already Requested' : 'Request Tokens'}
          </button>

          <button
            onClick={addNetwork}
            className='mt-3 flex justify-center items-center gap-2 border border-[#6e54ff] w-full py-3 rounded-xl font-medium transition-all duration-300 text-[#6e54ff] hover:opacity-90 shadow-lg'>
            <IoMdAddCircle className=' size-5' />
            Add to metamask
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-3 text-sm text-[#0f1324]/50">
          Powered by winks.fun
        </div>
      </div>
    </div>
  );
};

export default App;