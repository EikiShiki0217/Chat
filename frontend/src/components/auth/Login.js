import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Cookies from "js-cookie";

const ContainerDiv = styled.div`
  display: flex;
  height: var(--full-height);
  margin: auto;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const FormSectionDiv = styled.div`
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const FormItemsDiv = styled.div`
  width: 100%;
  height: 100px;
`;

const FormInput = styled.input`
  width: 100%;
  font-size: 1.3rem;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.3);
  margin-top: 0.5rem;
`;

const FormLabel = styled.label`
  margin: 0.7rem 0;
  font-size: 1.3rem;
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

const RegisterDivButton = styled.div`
  display: flex;
  margin-top: 0.3rem;
`;

const RegisterDiv = styled.div`
  margin: auto;
  font-size: 1rem;
  padding: 0.6rem;
  border-radius: 2rem;
`;

const ErrorMessage = styled.p`
  color: red;
  font-weight: 600;
  font-size: 1.2rem;
  text-align: center;
`;

const Login = () => {
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [loginName, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://172.16.151.37:3500/api/auth/login",
        {
          loginName,
          password,
        }
      );
      Cookies.set("jwt", response.data.accessToken, { expires: 7 });
      setLoginName("");
      setPassword("");
      navigate("/chats");
    } catch (err) {
      setErrMsg(err.response.data.message)
      errRef.current.focus();
    }
  };

  const handleUserInput = (e) => setLoginName(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);

  const content = (
    <ContainerDiv>
      <FormSectionDiv>
        <form className="form" onSubmit={handleSubmit}>
          <FormItemsDiv>
            <FormLabel htmlFor="username">Нэвтрэх нэр</FormLabel>
            <FormInput
              className="form__input"
              type="text"
              id="loginName"
              ref={userRef}
              value={loginName}
              onChange={handleUserInput}
              autoComplete="off"
              required
            />
          </FormItemsDiv>

          <FormItemsDiv>
            <FormLabel htmlFor="password">Нууц үг</FormLabel>
            <FormInput
              className="form__input"
              type="password"
              id="password"
              onChange={handlePwdInput}
              value={password}
              required
            />
          </FormItemsDiv>

          <ErrorMessage ref={errRef} aria-live="assertive">
            {errMsg}
          </ErrorMessage>
          <FormItemsDivButton>
            <Button>Нэвтрэх</Button>
          </FormItemsDivButton>
          <RegisterDivButton>
            <RegisterDiv>
              <Link to="/register">Бүртгэлгүй бол?</Link>
            </RegisterDiv>
          </RegisterDivButton>
        </form>
      </FormSectionDiv>
    </ContainerDiv>
  );

  return content;
};
export default Login;
