 # Introduction

![BostonEstate Logo](https://ipfs.io/ipfs/QmeSB86HqWqENPERD9QNFaEzE6f1EHwLRhEA9XXZ39jRS1?filename=web.png)

BostonEstate is a decentralized real estate platform leveraging blockchain technology to provide secure and transparent property transactions. This platform allows users to browse, purchase, and sell properties using smart contracts.

BostonEstate aims to revolutionize the real estate industry by using blockchain technology to ensure secure and transparent property deals. Our platform enables users to explore various properties, view detailed information, and conduct transactions with ease and confidence.

# Features

- **Decentralized Transactions**: All property transactions are carried out using smart contracts on the Ethereum blockchain.
- **Secure and Transparent**: Blockchain technology ensures the security and transparency of all transactions.
- **Detailed Property Listings**: Browse through a variety of properties with detailed descriptions, images, and attributes.
- **Easy Wallet Integration**: Connect your Ethereum wallet to manage transactions seamlessly.

# Technology Stack & Tools

- **Solidity**: Writing Smart Contracts & Tests
- **Javascript**: React & Testing
- **Hardhat**: Development Framework
- **Ethers.js**: Blockchain Interaction
- **React.js**: Frontend Framework
- **IPFS**: Content Distribution Network
- **Web 3.0**: Leveraging decentralized networks and protocols for secure and transparent real estate transactions

# How It Works

### User Flow

1. **Connect Wallet**: Users connect their Ethereum wallet to the platform.
2. **Browse Properties**: Users can explore listed properties with detailed descriptions and images.
3. **View Property Details**: Clicking on a property provides more information, including price, number of bedrooms, bathrooms, and other attributes.
4. **Purchase Property**: Users can initiate the purchase process directly from the property details page.
5. **Transaction Processing**: The platform uses smart contracts to process the transaction securely and transparently.

### Smart Contracts

The platform uses two main smart contracts:

- **RealEstate**: Manages the listing and details of properties.
- **Escrow**: Handles the purchase transactions, ensuring that funds are securely held until all conditions are met.

### Frontend

The frontend is built using React.js and interacts with the blockchain through the Ethers.js library. The user interface provides an intuitive experience for browsing properties and managing transactions.

## Setup & Installation

### Prerequisites

- Node.js (version 18.x or higher)
- npm or yarn
- Ethereum wallet (e.g., MetaMask extension installed on your browser)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/chandima2000/web-3.0-Real-Estate-App.git
    cd web-3.0-Real-Estate-App
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

### Running the Application

1. Open new Terminal & Run Test Script
    ```bash
    npx hardhat test
    ```

2. Start the Blockchain Development Environment:

    ```bash
    npx hardhat node
    ```
3. Run the Hardhat script

     ```bash
    npx hardhat run scripts/deploy.js --network localhost
    ```

4. Run the Frontend development server
    ```bash
    npm start
    ```

## Usage

1. **Connecting Wallet**: Click on the "Connect to Wallet" button to connect your Ethereum wallet.
2. **Browsing Properties**: Explore the available properties listed on the homepage.
3. **Viewing Details**: Click on any property card to view detailed information.
4. **Purchasing**: If you wish to purchase a property, click the "Buy" button and follow the on-screen instructions.

## Contributions
All contributions are welcome. Feel free to open issues or submit pull requests.
