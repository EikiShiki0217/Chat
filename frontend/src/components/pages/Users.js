import styled from "styled-components";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import User from "./adapters/User";
import ClipLoader from "react-spinners/ClipLoader";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  max-height: 100vh;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
`;

const ConversationBar = styled.div`
  display: flex;
  height: 100vh;
  max-height: 100vh;
  width: 30rem;
  border-right: 1px solid gray;
  overflow-x: auto;
  overflow-y: hidden;
`;

const ConversationDiv = styled.div`
  width: 100%;
  display: block;
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
`;

const RightSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  height: 100vh;
`;

const Center = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

const Conversations = () => {
  const [myId, setMyId] = useState("");
  const [users, setUsers] = useState("");

  useEffect(() => {
    const token = Cookies.get("jwt");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setMyId(decodedToken.UserInfo?.id);
      } catch (decodeError) {
        console.error("Error decoding token:", decodeError.message);
      }
    }
  }, [myId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://172.16.151.37:3500/api/user/getUsers"
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const uc = () => {
    if (users?.length) {
      const ids = users.map((user) => user._id);
      const usersContent =
        ids?.length &&
        ids.map((userId) => {
          const isCurrentUserId = userId === myId;

          return isCurrentUserId ? null : <User key={userId} userId={userId} />;
        });
      return usersContent;
    } else {
      return (
        <Center>
          <ClipLoader color="blue" size={40} />
        </Center>
      );
    }
  };

  const userContent = uc();
  const content = (
    <Container>
      <ConversationBar>
        <ConversationDiv>
          {userContent}
        </ConversationDiv>
      </ConversationBar>
      <RightSection>
        <Outlet />
      </RightSection>
    </Container>
  );
  return content;
};
export default Conversations;
