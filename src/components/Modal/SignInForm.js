import React, { useState } from "react";
import "./Modal.css";

import logo from "./logo.png"
import Button from "./Button.js";

import { signInAuthUserWithEmailAndPassword, auth } from "./firebase.js";

import FormInput from "./FormInput.js";
const defaultFormFields = {
  email: "",
  password: "",
};

const SignInForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;
  //const user = auth.currentUser;

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await signInAuthUserWithEmailAndPassword(email, password).then(() => {
        console.log("signing in " + auth.currentUser.email);
        //alert("Signed in as " + auth.currentUser.email);
      });
      resetFormFields();
    } catch (error) {
      console.log("user sign in failed", error);
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
        <Button className="submitButton" type="submit">
          LOG IN
        </Button>

      </form>
    </div>
  );
};

export default SignInForm;
