import { ethers } from "ethers";
import { useEffect, useState } from "react";

import close from "../assets/close.svg";

const Property = ({ home, provider, escrow, togglePop }) => {
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
