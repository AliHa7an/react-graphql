import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { getTokenState } from "../graphql/ApolloClient";
import { LOGIN_MUTATION } from "../graphql/Mutations";
import "../style/login.scss";
import { Calls } from "./Calls";

export const Login = () => {
  const [errorMessages, setErrorMessages] = useState<{
    name?: string;
    message?: string;
  }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [login, { error, data }] = useMutation<LoginInput>(LOGIN_MUTATION);

  useEffect(() => {
    if (error && !data) {
      setErrorMessages(error);
    }
    const token = localStorage.getItem("accessToken");
    if (token) {
      const state = getTokenState(token);
      console.log({ state });
      if (state.valid) {
        setIsSubmitted(true);
      }
    }
  }, [error, data]);

  const handleSubmit = async (event: React.SyntheticEvent<EventTarget>) => {
    event.preventDefault();
    var { uname, pass } = document.forms[0];
    if (uname && pass) {
      await login({
        variables: {
          input: {
            username: uname.value,
            password: pass.value,
          },
        },
      }).then((result) => {
        //@ts-ignore
        localStorage.setItem("accessToken", result?.data?.login?.access_token);
        localStorage.setItem(
          "refreshToken",
          //@ts-ignore
          result?.data?.login?.refresh_token
        );
        setIsSubmitted(true);
      });
    }
  };

  const renderErrorMessage = (name: string) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  const renderForm = (
    <div className="form">
      <form id="login" onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" required />
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" required />
          {renderErrorMessage("pass")}
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
  );

  return (
    <div className="app">
      <div className="login-form">
        <div className="title">{isSubmitted ? "Calls List" : "Sign In"} </div>
        {isSubmitted ? <Calls /> : renderForm}
      </div>
    </div>
  );
};
