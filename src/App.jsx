import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Components
import Navigation from './components/Navigation';
import Search from './components/Search';
import Home from './components/Home';

// ABIs
import RealEstate from './abis/RealEstate.json'
import Escrow from './abis/Escrow.json'

// Config
import config from './config.json';

function App() {

  const [account, setAccount] = useState([]);

  const loadBlockchainData = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
    console.log(account[0])
  }
  
  useEffect(() => {
    loadBlockchainData();
  },[]);

  return (
    <div>

      <div className='cards__section'>
        <Navigation/>
        <h3>Welcome to Real Estate</h3>

      </div>

    </div>
  );
}

export default App;
