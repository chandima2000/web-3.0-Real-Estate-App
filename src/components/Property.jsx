import { ethers } from "ethers";
import { useEffect, useState } from "react";

import close from "../assets/close.svg";

const Property = ({ home, provider, account, escrow, togglePop }) => {

  const [hasBought, setHasBought] = useState(false);
  const [hasLend, setHasLend] = useState(false);
  const [hasInspected, setHasInspected] = useState(false);
  const [hasSold, setHasSold] = useState(false);

  const [buyer, setBuyer] = useState(null);
  const [lender, setLender] = useState(null);
  const [inspector, setInspector] = useState(null);
  const [seller, setSeller] = useState(null);

  const [newOwner, setNewOwner] = useState(null);

  const fetchDetails = async () => {
    // Buyer
    const buyer = await escrow.buyer(home.id);
    setBuyer(buyer);

    const hasBought = await escrow.isApproved(home.id, buyer);
    setHasBought(hasBought);

    // Seller
    const seller = await escrow.seller();
    setSeller(seller);

    const hasSold = await escrow.isApproved(home.id, seller);
    setHasSold(hasSold);

    // Lender
    const lender = await escrow.lender();
    setLender(lender);

    const hasLend = await escrow.isApproved(home.id, lender);
    setHasLend(hasLend);

    // Inspector
    const inspector = await escrow.inspector();
    setInspector(inspector);

    const hasInspected = await escrow.isInspectionPassed(home.id);
    setHasInspected(hasInspected);
  };

    // Get the new Owner
  const getNewOwner = async () => {

    if (await escrow.isListed(home.id)) return
    
    const newOwner = await escrow.buyer(home.id);
    setNewOwner(newOwner);
  };


  // Handle the buyer Approval
  const buyHandler = async () => {
    const escrowAmount = await escrow.escrowAmount(home.id)
    const signer = await provider.getSigner()

    // Buyer deposit earnest
    let transaction = await escrow.connect(signer).depositEarnest(home.id, { value: escrowAmount })
    await transaction.wait()

    // Buyer approves
    transaction = await escrow.connect(signer).saleApproval(home.id)
    await transaction.wait()

    setHasBought(true)
}


 // Handle the Inspector Approval
const inspectHandler = async () => {
    const signer = await provider.getSigner()

    // Inspector updates status
    const transaction = await escrow.connect(signer).updateInspectionStatus(home.id, true)
    await transaction.wait()

    setHasInspected(true)
}


 // Handle the Lender Approval
const lendHandler = async () => {
    const signer = await provider.getSigner()

    // Lender approves
    const transaction = await escrow.connect(signer).saleApproval(home.id)
    await transaction.wait()

    // Lender sends funds to contract
    const lendAmount = (await escrow.purchasePrice(home.id) - await escrow.escrowAmount(home.id))
    await signer.sendTransaction({ to: escrow.address, value: lendAmount.toString(), gasLimit: 60000 })

    setHasLend(true)
}


 // Handle the Seller Approval
const sellHandler = async () => {
    const signer = await provider.getSigner()

    // Seller approves
    let transaction = await escrow.connect(signer).saleApproval(home.id)
    await transaction.wait()

    // Seller finalize
    transaction = await escrow.connect(signer).finalizedSale(home.id)
    await transaction.wait()

    setHasSold(true)
}


    useEffect(() => {

        fetchDetails();
        getNewOwner();
        
    },
    [hasSold]);

  return (
    <div className="home">
      <div className="home__details">
        <div className="home__image">
          <img src={home.image} alt="Home" />
        </div>
        <div className="home__overview">
          <h1>{home.name}</h1>
          <p>
            <strong>{home.attributes[2].value}</strong> beds |
            <strong>{home.attributes[3].value}</strong> baths |
            <strong>{home.attributes[4].value}</strong> sqft
          </p>
          <p>{home.address}</p>
          <hr />
          <h4>Price: {home.attributes[0].value} ETH</h4>

          <hr />

          <h2>Overview</h2>

          <p> {home.description} </p>

          <hr />

          <h2>Facts and features</h2>

          <ul>
            {home.attributes.map((attribute, index) => (
              <li key={index}>
                <strong>{attribute.trait_type}</strong> : {attribute.value}
              </li>
            ))}
          </ul>

          {newOwner ? (
            <div className="home__owned">
              Owned by {newOwner.slice(0, 6) + "..." + newOwner.slice(38, 42)}
            </div>
          ) : (
            <div>
              {(account === inspector) ? (
                <button
                  className="home__buy"
                  onClick={inspectHandler}
                  disabled={hasInspected}
                >
                  Approve Inspection
                </button>
              ) : (account === lender) ? (
                <button
                  className="home__buy"
                  onClick={lendHandler}
                  disabled={hasLend}
                >
                  Approve & Lend
                </button>
              ) : (account === seller) ? (
                <button
                  className="home__buy"
                  onClick={sellHandler}
                  disabled={hasSold}
                >
                  Approve & Sell
                </button>
              ) : (
                <button
                  className="home__buy"
                  onClick={buyHandler}
                  disabled={hasBought}
                >
                  Buy
                </button>
              )}

              <button className="home__contact">Contact agent</button>
            </div>
          )}
        </div>

        <button onClick={togglePop} className="home__close">
          <img src={close} alt="Close" />
        </button>
      </div>
    </div>
  );
};

export default Property;
