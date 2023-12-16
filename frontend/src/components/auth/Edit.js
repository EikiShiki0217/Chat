import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
const FullScreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ExitButtonDiv = styled.div`
  width: 5rem;
  height: 5rem;
  display: block;
  cursor: pointer;
  position: absolute;
  top: 0.5rem;
  right: 0.8rem;
`;

const ExitButton = styled.img`
  width: 100%;
`;

const EditSect = styled.div`
  background: #fff;
  width: 50%;
  height: auto;
  border-radius: 1rem;
`;

const EditForm = styled.div`
  margin: 2rem auto;
  width: 90%;
  height: 80%;
  display: flex;
  flex-direction: column;
`;

const FormItems = styled.div`
  width: 90%;
  margin: 0.3rem auto;
  display: flex;
  flex-direction: column;
`;

const FormLabels = styled.label`
  margin: 0.7rem 0;
  font-size: 1.3rem;
`;

const FormInput = styled.input`
  width: auto;
  font-size: 1.3rem;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.3);
  margin-top: 0.5rem;
`;

const FormItemsDivButton = styled.div`
  display: flex;
  margin-top: 1.4rem;
`;

const Button = styled.button`
  margin: auto;
  font-size: 1.3rem;
  padding: 0.6rem;
  border-radius: 2rem;
  width: 150px;
  cursor: pointer;
  background-color: #0089ff;
  color: #fff;
  border: 0px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-weight: 600;
  font-size: 1.2rem;
  text-align: center;
`;

const Edit = ({ myId, setIsEdit }) => {
  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setErrMsg("");
  }, [username, email, phone, password, passwordConfirmation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://172.16.151.37:3500/api/auth/update", {
        myId,
        username,
        email,
        phone,
        password,
        passwordConfirmation,
      });
      handleEdit();
    } catch (err) {
      setErrMsg(err.response.data.message);
      errRef.current.focus();
    }
  };

  const handleEdit = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setPhone("");
    setPasswordConfirmation("");
    setIsEdit(false);
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handleEmailInput = (e) => setEmail(e.target.value);
  const handlePhoneInput = (e) => {
    if (!isNaN(e.target.value)) {
      setPhone(e.target.value);
    }
  };
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handlePwdCInput = (e) => setPasswordConfirmation(e.target.value);

  return (
    <FullScreenOverlay>
      <ExitButtonDiv onClick={handleEdit}>
        <ExitButton src={__dirname + "ic_exit.png"} />
      </ExitButtonDiv>
      <EditSect>
        <form className="form" onSubmit={handleSubmit}>
          <EditForm>
            <FormItems>
              <FormLabels>Нэр</FormLabels>
              <FormInput
                type="text"
                id="username"
                ref={userRef}
                value={username}
                onChange={handleUserInput}
                autoComplete="none"
                required
              />
            </FormItems>
            <FormItems>
              <FormLabels>Цахим хаяг</FormLabels>
              <FormInput
                type="email"
                id="email"
                ref={userRef}
                value={email}
                onChange={handleEmailInput}
                autoComplete="none"
                required
              />
            </FormItems>
            <FormItems>
              <FormLabels>Утасны дугаар</FormLabels>
              <FormInput
                type="text"
                id="phone"
                ref={userRef}
                value={phone}
                onChange={handlePhoneInput}
                autoComplete="none"
                required
              />
            </FormItems>
            <FormItems>
              <FormLabels>Нууц үг</FormLabels>
              <FormInput
                type="password"
                id="password"
                onChange={handlePwdInput}
                value={password}
                autoComplete="none"
                required
              />
            </FormItems>
            <FormItems>
              <FormLabels>Нууц үг баталгаажуулах</FormLabels>
              <FormInput
                type="password"
                id="passwordConfirmation"
                onChange={handlePwdCInput}
                value={passwordConfirmation}
                autoComplete="none"
                required
              />
            </FormItems>
            <ErrorMessage ref={errRef} aria-live="assertive">
              {errMsg}
            </ErrorMessage>
            <FormItemsDivButton>
              <Button>Хадгалах</Button>
            </FormItemsDivButton>
          </EditForm>
        </form>
      </EditSect>
    </FullScreenOverlay>
  );
};

export default Edit;
