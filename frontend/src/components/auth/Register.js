import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

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
  const userRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, email, phone, password, passwordConfirmation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://172.16.151.37:3500/api/auth/register", {
        username,
        email,
        phone,
        password,
        passwordConfirmation,
      });
      setUsername("");
      setPassword("");
      setEmail("");
      setPhone("");
      setPasswordConfirmation("");
      navigate("/login");
    } catch (err) {
      setErrMsg(err.response.data.message);
      errRef.current.focus();
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handleEmailInput = (e) => setEmail(e.target.value);
  const handlePhoneInput = (e) => {
    if (!isNaN(e.target.value)) {
      setPhone(e.target.value);
    }
  };
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handlePwdCInput = (e) => setPasswordConfirmation(e.target.value)

  const content = (
    <ContainerDiv>
      <FormSectionDiv>
        <form className="form" onSubmit={handleSubmit}>
          <FormItemsDiv>
            <FormLabel htmlFor="username">Хэрэглэгчийн нэр</FormLabel>
            <FormInput
              type="text"
              id="username"
              ref={userRef}
              value={username}
              onChange={handleUserInput}
              autoComplete="none"
              required
            />
          </FormItemsDiv>
          <FormItemsDiv>
            <FormLabel htmlFor="email">Цахим хаяг</FormLabel>
            <FormInput
              type="email"
              id="email"
              ref={userRef}
              value={email}
              onChange={handleEmailInput}
              autoComplete="none"
              required
            />
          </FormItemsDiv>
          <FormItemsDiv>
            <FormLabel htmlFor="phone">Утасны дугаар</FormLabel>
            <FormInput
              type="text"
              id="phone"
              ref={userRef}
              value={phone}
              onChange={handlePhoneInput}
              autoComplete="none"
              required
            />
          </FormItemsDiv>
          <FormItemsDiv>
            <FormLabel htmlFor="password">Нууц үг</FormLabel>
            <FormInput
              type="password"
              id="password"
              onChange={handlePwdInput}
              value={password}
              autoComplete="none"
              required
            />
          </FormItemsDiv>
          <FormItemsDiv>
            <FormLabel htmlFor="passwordConfirmation">
              Нууц үг баталгаажуулах
            </FormLabel>
            <FormInput
              type="password"
              id="passwordConfirmation"
              onChange={handlePwdCInput}
              value={passwordConfirmation}
              autoComplete="none"
              required
            />
          </FormItemsDiv>
          <ErrorMessage ref={errRef} aria-live="assertive">
            {errMsg}
          </ErrorMessage>
          <FormItemsDivButton>
            <Button>Бүртгүүлэх</Button>
          </FormItemsDivButton>
          <RegisterDivButton>
            <RegisterDiv>
              <Link to="/login">Бүртгэлтэй бол?</Link>
            </RegisterDiv>
          </RegisterDivButton>
        </form>
      </FormSectionDiv>
    </ContainerDiv>
  );

  return content;
};
export default Login;
