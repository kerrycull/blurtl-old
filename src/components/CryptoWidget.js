import React, { useState, useEffect } from "react";
import "./CryptoWidget.css";

const currencies = [
  "SOL",
  "XRP",
  "ETH",
  "BTC",
  "BNB",
  "ADA",
  "LTC",
];

const tickers = currencies.map((currency) => ({
  currency: currency,
  ticker: `fsym=${currency}&tsyms=USD`,
}));

function formatPrice(price) {
  if (price >= 100) {
    return Math.round(price).toString();
  } else if (price < 1) {
    return price.toFixed(3);
  } else {
    return price.toFixed(2);
  }
}

function CryptoWidget() {
  const [prices, setPrices] = useState(null);
  
  useEffect(() => {
    const fetchData = () => {
      Promise.all(
        tickers.map((ticker) =>
          fetch(
            `https://min-api.cryptocompare.com/data/price?${ticker.ticker}`
          ).then((response) => response.json())
        )
      )
        .then((data) => {
          setPrices(data);
        })
        .catch((error) => console.error(error));
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 120000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="price-list-container">
      {tickers.map((ticker, index) => (
        <div key={index}>
          <div className="price-container">
            <h3>{ticker.currency}</h3>
            <ul className="price-list">
              {!prices ? (
                <li>0.00</li>
              ) : (
                <li>{formatPrice(Object.values(prices[index])[0])}</li>
              )}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CryptoWidget;
