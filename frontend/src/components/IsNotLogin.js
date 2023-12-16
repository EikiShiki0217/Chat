import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Outlet } from "react-router-dom";

const IsLogin = () => {
  const token = Cookies.get("jwt");
  let content;
  if (!token?.length) {
    content = <Outlet />;
  } else {
    content = <Navigate to="/chats" />;
  }
  return content;
};
export default IsLogin;
