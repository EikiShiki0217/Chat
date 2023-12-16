import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { memo, useEffect, useState } from "react";
import axios from "axios";

const UserDiv = styled.div`
  height: 3rem;
  width: 100%;
  list-style: none;
  display: flex;
  align-items: center;
  color: black;
  padding: 15px;
  font-size: 1.4rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const UserProfile = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  margin-right: 0.4rem;
`;

const NameDiv = styled.div`
  font-size: 1.6rem;
`;

const ChatDiv = styled.div`
  font-size: 1.2rem;
  color: rgba(0, 0, 0, 0.6);
`;

const Conversation = ({
  userId,
  senderId,
  myId,
  chat,
  chatType,
  timestamp,
}) => {
  const [user, setUser] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.post(
          "http://172.16.151.37:3500/api/user/getuser",
          { userId }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchConversations();
  }, [userId]);

  const handleEdit = () => navigate(`/chats/${userId}`);

  if (chatType === "image") {
    chat = "Зураг илгээлээ.";
  }
  if (senderId === myId) {
    chat = "You: " + chat;
  }
  const content = (
    <UserDiv onClick={handleEdit}>
      <UserProfile src={user.profile !== null ? user.profile : __dirname + "profile_default.png"} />
      <div>
        <NameDiv>{user.username}</NameDiv>
        <ChatDiv>{chat}</ChatDiv>
      </div>
    </UserDiv>
  );

  return content;
};

const memoizedUser = memo(Conversation);

export default memoizedUser;
