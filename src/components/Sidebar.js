import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';

function Sidebar() {
  return (
    <div className="side">
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
              <Link to="/rising">
                <h3 className="nongreyed">Rising</h3>
              </Link>
            </li>
            <li>
              <Link to="https://blurtl.beehiiv.com/subscribe">
                <h1 className="nongreyed">
                  <FontAwesomeIcon icon={faEnvelope} />
                </h1>
              </Link>
            </li>
          </ul>
        </nav>
    </div>
  );
}

export default Sidebar;
