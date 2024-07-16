import { ethers } from 'ethers';
import logo from '../assets/logo.svg';

const Navigation = ({ account, setAccount }) => {
    const connectHandler = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.getAddress(accounts[0])
        setAccount(account);
    }

    return (
        <nav>

            <div className='nav__brand'>
                <img src={logo} alt="Logo" />
                <h1>BostonEstate</h1>
            </div>

            {account ? (
                <button
                    type="button"
                    className='nav__connect-2'
                >
                    {account.slice(0, 6) + '...' + account.slice(38, 42)}
                </button>
            ) : (
                <button
                    type="button"
                    className='nav__connect'
                    onClick={connectHandler}
                >
                    Connect to Wallet
                </button>
            )}
        </nav>
    );
}

export default Navigation;