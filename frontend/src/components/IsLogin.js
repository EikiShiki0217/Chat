import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import Layout from "./Layout";

const IsLogin = () => {
  const token = Cookies.get("jwt");

  let content;
  if (!token?.length) {
    content = <Navigate to="/login" />;
  } else {
    content = <Layout />;
  }
  return content;
};
export default IsLogin;
