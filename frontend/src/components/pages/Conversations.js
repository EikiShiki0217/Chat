import styled from "styled-components";
import { Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import Conversation from "./adapters/Conversation";
import socketIOClient from "socket.io-client";
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
  const { himId } = useParams();
  const [myId, setMyId] = useState("");
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const socket = socketIOClient("http://172.16.151.37:3500");

    socket.on("newConversation", async (updatedData) => {
      try {
        const response = await axios.post(
          "http://172.16.151.37:3500/api/chat/getChat",
          { chatId: updatedData }
        );

        const newChat = response.data[0];

        if (newChat.receiverId === myId || newChat.senderId === myId) {
          const index = conversations.findIndex(
            (conversation) =>
              (conversation.senderId === newChat.senderId &&
                conversation.receiverId === newChat.receiverId) ||
              (conversation.receiverId === newChat.senderId &&
                conversation.senderId === newChat.receiverId)
          );
          console.log(index);
          if (index !== -1) {
            const updatedConversations = [...conversations];
            updatedConversations[index] = newChat;
            setConversations(updatedConversations);
          } else {
            setConversations((conversation) => [...conversation, newChat]);
          }
        }
      } catch (err) {}
    });
    return () => {
      socket.disconnect();
    };
  }, [conversations, setConversations, himId, myId]);

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
    if (myId?.length) {
      const fetchConversations = async () => {
        try {
          const response = await axios.post(
            "http://172.16.151.37:3500/api/chat/getConversations",
            {
              myId,
            }
          );
          setConversations(response.data);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      if (myId !== "") {
        fetchConversations();
      }
    }
  }, [myId, setConversations]);

  const conversationsContent = conversations?.length ? (
    conversations.map((conversation, index) => {
      const isSenderMe = conversation.senderId === myId;

      return isSenderMe ? (
        <Conversation
          key={index}
          userId={conversation.receiverId}
          senderId={conversation.senderId}
          myId={myId}
          chat={conversation.chat}
          chatType={conversation.chatType}
          timestamp={conversation.timestamp}
        />
      ) : (
        <Conversation
          key={index}
          userId={conversation.senderId}
          senderId={conversation.senderId}
          myId={myId}
          chat={conversation.chat}
          chatType={conversation.chatType}
        />
      );
    })
  ) : (
    <Center>
      <ClipLoader color="blue" size={40} />
    </Center>
  );

  const content = (
    <Container>
      <ConversationBar>
        <ConversationDiv>{conversationsContent}</ConversationDiv>
      </ConversationBar>
      <RightSection>
        <Outlet />
      </RightSection>
    </Container>
  );
  return content;
};
export default Conversations;
