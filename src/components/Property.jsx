import { ethers } from "ethers";
import { useEffect, useState } from "react";

import close from "../assets/close.svg";

const Property = ({ home, provider, escrow, togglePop }) => {


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
        const buyer = await escrow.getBuyer(home.id);
        setBuyer(buyer);

        const hasBought = await escrow.saleApproval(home.id, buyer);
        setHasBought(hasBought);


        // Seller
        const seller = await escrow.seller();
        setSeller(seller);

        const hasSold = await escrow.saleApproval(home.id, seller);
        setHasSold(hasSold);


        // Lender
        const lender = await escrow.lender();
        setLender(lender);

        const hasLend = await escrow.saleApproval(home.id, lender);
        setHasLend(hasLend);


        // Inspector
        const inspector = await escrow.inspector();
        setInspector(inspector);

        const hasInspected = await escrow.isInspectionPassed(home.id);
        setHasInspected(hasInspected);

    }

    const getNewOwner = async () => {
        const newOwner = await escrow.buyer(home.id);
        setNewOwner(newOwner);
    }

    useEffect(() => {

        fetchDetails();
        getNewOwner();

    }, [hasSold])

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

          <button className="home__buy">Buy Home</button>
          <button className="home__contact">Contact agent</button>
        </div>

        <button onClick={togglePop} className="home__close">
          <img src={close} alt="Close" />
        </button>
      </div>
    </div>
  );
};

export default Property;
