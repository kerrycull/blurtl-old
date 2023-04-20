import React from "react";
import "../App.css";
import Modal from "./Modal/Modal.js";
import Footer from "./Footer.js";
import logo from "../images/logo.png";

function Navbar() {
  return (
    <div className="top">
      <div className="navigation">
      <img className="logo" src={logo} width='30px' alt="blurtl"/>
        <nav>
          <ul>
            <li>
              <Modal />
            </li>
          </ul>
        </nav>
      </div>
      < Footer/>
    </div>
  );
}

export default Navbar;
