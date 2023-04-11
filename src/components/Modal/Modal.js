import React, { useState, useEffect } from "react";
import "./Modal.css";

import { signOutUser, auth, onAuthStateChangedListener } from "./firebase.js";

import SignInForm from "./SignInForm.js";

const Modal = () => {
  const [modal, setModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(() => {
      if (auth.currentUser) {
        console.log("user currently signed in " + auth.currentUser.email);
        setCurrentUser(auth.currentUser);
        setModal(false);
      } else {
        console.log("user currently signed out");
        setCurrentUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <>
      {currentUser ? (
        <h3 onClick={signOutUser} className="nongreyed">
          Log out
        </h3>
      ) : (
        <h3 onClick={toggleModal} className="nongreyed">
          Log in
        </h3>
      )}

      {modal && (
        <div className="modal">
          <div className="overlay">
            <div className="modal-content">
              <SignInForm />
              <button className="close-modal" onClick={toggleModal}>
                X
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
