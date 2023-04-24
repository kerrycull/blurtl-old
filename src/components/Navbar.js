import React from "react";
import "../App.css";
import Modal from "./Modal/Modal.js";
import Footer from "./Footer.js";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="top">
      <div className="navigation">
        <Link to="/">
          <img className="logo" src={logo} width='30px' alt="blurtl"/>
        </Link>
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
