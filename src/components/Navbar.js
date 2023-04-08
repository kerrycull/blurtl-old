import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Navbar() {
  return (
    <div className="top">
      <div className="header">
        <h2>blurtl</h2>
        <h5>real-time cryptocurrency news.</h5>
      </div>
      <div className="navigation">
        <nav>
          <ul>
            <li>
              <Link to="/">
                <h3 className="nongreyed">Latest</h3>
              </Link>
            </li>
            <li>
              <Link to="/top">
                <h3 className="nongreyed">Top</h3>
              </Link>
            </li>
            <li>
              <Link to="">
                <h3 className="greyed">Rising</h3>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
