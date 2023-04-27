import React, { useState } from "react";
import "./Modal.css";

import logo from "./logo.png"
import Button from "./Button.js";

import { signOutUser } from "./firebase.js";

const SettingsForm = () => {
  return (
    <div className="settingsBox">
      <img className="logo2" src={logo} width='60px' alt="blurtl"/>
        <Button className="submitButton" onClick={signOutUser}>
          LOG OUT
        </Button>
    </div>
  );
};

export default SettingsForm;
