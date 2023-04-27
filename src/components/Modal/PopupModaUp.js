import React, { useState, useEffect } from "react";
import "./Modal.css";

import { auth, onAuthStateChangedListener } from "./firebase.js";

import SignInForm from "./SignInForm.js";
import SignUpForm from "./SignUpForm.js";
import SettingsForm from "./SettingsForm.js";

const PopupModalUp = () => {
  const [modal, setModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [showSignIn, setShowSignIn] = useState(true);

  const handleToggle = () => {
    setShowSignIn(!showSignIn);
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  if (modal) {
    //console.log(auth.currentUser);
    document.body.classList.add("active-modal");
  } else {
    //console.log(auth.currentUser);
    document.body.classList.remove("active-modal");
  }

  const checkUser = () => {
    if (currentUser === null) {
      toggleModal();
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(() => {
      if (auth.currentUser) {
        console.log("user currently signed in " + auth.currentUser.email);
        setCurrentUser(auth.currentUser);
      } else {
        console.log("user currently signed out");
        setCurrentUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <>   
      <button className="voteButton" onClick={checkUser}>
        ↑   
      </button>

      {modal && (
        <div className="modal">
          <div className="overlay">
            <div className="modal-content">
              {currentUser ? (
                <SettingsForm />
              ) : (
                showSignIn ? <SignInForm /> : <SignUpForm />
              )}

              <button className="close-modal" onClick={toggleModal}>
                X
              </button>

              {!currentUser && (
                <button onClick={handleToggle} className="submitButton2">
                  {showSignIn ? 'SIGN UP' : 'LOG IN' }
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupModalUp;