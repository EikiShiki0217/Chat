import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import IsLogin from "./components/IsLogin";
import IsNotLogin from "./components/IsNotLogin";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Conversations from "./components/pages/Conversations";
import Chat from "./components/pages/Chat";
import WithoutChat from "./components/pages/WithoutChat";
import Users from "./components/pages/Users";
import Profile from "./components/auth/Profile"
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
function App() {
  const getMyIdFromToken = () => {
    const token = Cookies.get("jwt");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.UserInfo?.id;
      } catch (decodeError) {
        console.error("Error decoding token:", decodeError.message);
      }
    }
  }
  const userId = getMyIdFromToken();
  return (
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route element={<IsLogin />}>
          <Route index element={<Navigate to="/chats" />} />
          <Route path="chats" element={<Conversations />}>
            <Route index element={<WithoutChat />} />
            <Route path=":himId" element={<Chat />} />
          </Route>
          <Route path="contacts" element={<Users />}>
            <Route index element={<WithoutChat />} />
            <Route path=":himId" element={<Chat />} />
          </Route>
          <Route path="profile">
            <Route index element={<Navigate to={`/profile/${userId}`} />} /> 
            <Route path=":userId" element={<Profile />} />
          </Route>
        </Route>
        <Route element={<IsNotLogin />}>
          <Route index element={<Navigate to="/login" />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
