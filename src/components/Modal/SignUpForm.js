import React, { useState } from "react";
import "./Modal.css";

import logo from "./logo.png"
import Button from "./Button.js";

import { signInAuthUserWithEmailAndPassword, createAuthUserWithEmailAndPassword, auth } from "./firebase.js";

import FormInput from "./FormInput.js";
const defaultFormFields = {
  email: "",
  password: "",
  passwordConfirm: "",
};

const SignUpForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password, passwordConfirm } = formFields;
  //const user = auth.currentUser;

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (password !== passwordConfirm) {
        alert("Passwords don't match");
        return;
      } else if (password.length >= 6) {
      await createAuthUserWithEmailAndPassword(email, password).then(() => {
        console.log("signing in " + auth.currentUser.email);
        signInAuthUserWithEmailAndPassword(email, password);
        //alert("Signed in as " + auth.currentUser.email);
        resetFormFields();
      });
    } else {
      alert("Password must be at least 6 characters");
      return;
    }
    } catch (error) {
      alert("User already exists");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className="formBox">
      <img className="logo2" src={logo} width='60px' alt="blurtl"/>
      <form className="formClass" onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="email"
          placeholder="Email"
          required
          onChange={handleChange}
          name="email"
          value={email}
        />

        <FormInput
          label="Password"
          type="password"
          placeholder="Password"
          required
          onChange={handleChange}
          name="password"
          value={password}
        />
        
        <FormInput
          label="PasswordConfirm"
          type="password"
          placeholder="Confirm password"
          required
          onChange={handleChange}
          name="passwordConfirm"
          value={passwordConfirm}
        />
        <Button className="submitButton" type="submit">
          SIGN UP
        </Button>

      </form>
    </div>
  );
};

export default SignUpForm;
