import styled from "styled-components";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import socketIOClient from "socket.io-client";
import ReceivedChat from "./adapters/RecievedChat";
import SendedChat from "./adapters/SendedChat";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
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

const ChattingSectionDiv = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: 100vh;
  width: 100%;
  border-right: 1px solid gray;
  overflow-x: auto;
  overflow-y: hidden;
`;

const Header = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: auto;
  padding: 0.625rem 1rem;
  border-bottom: 1px solid gray;
  z-index: 10;
`;

const UserDetailsDiv = styled.div`
  display: flex;
  align-items: center;
`;

const Body = styled.div`
  width: auto;
  height: 100%;
  outline: none;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column-reverse;
  position: relative;
`;

const Footer = styled.footer`
  width: auto;
  padding: 0.5rem 0.5rem 1.5rem 0.5rem;
  border-top: 1px solid gray;
  align-items: flex-start;
`;

const ItemsDiv = styled.div`
  display: flex;
  align-items: center;
`;

const ExtraDiv = styled.div`
  z-index: 10;
  bottom: 1.5rem;
`;

const Extras = styled.div`
  display: flex;
`;

const PictureDiv = styled.div`
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  &:hover {
    background-color: #f0f2f5;
  }
`;
const UserProfile = styled.img`
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 50%;
  margin-right: 0.4rem;
`;

const UserName = styled.label`
  font-size: 1.3rem;
`;

const InputChatDiv = styled.div`
  display: flex;
  flex-grow: 1;
`;

const InputWidth = styled.div`
  display: flex;
  width: 100%;
`;

const InputArea = styled.div`
  background-color: #f0f2f5;
  display: flex;
  width; 100%;
  padding: 0 1rem;
  align-items: center;
  flex-grow: 1;
  border-radius: 1.3rem;
  cursor: text;
`;

const InputTextArea = styled.input`
  background: transparent;
  border: none;
  display: flex;
  font-size: 1rem;
  flex: 1;
  &:focus {
    outline: none;
  }
`;

const SendButton = styled.button`
  margin-left: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;

  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #f0f2f5;
  }
`;

const ImageUploader = styled.input`
  width: 0px;
  font-size: 1.3rem;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.3);
  margin-top: 0.5rem;
  position: absolute;
  z-index: 1;
  opacity: 0;
`;

const Center = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background-color: #f0f2f5;
  }
`;

const InfoButton = styled.img`
  width: 2rem;
  height: 2rem;
`;

const Chat = () => {
  const [user, setUser] = useState("");
  const [myId, setMyId] = useState("");
  const { himId } = useParams();
  const [chats, setChats] = useState([]);
  const [image, setImage] = useState("");

  const navigate = useNavigate();
  const prevHimIdRef = useRef();

  useEffect(() => {
    // Update the previous himId when himId changes
    prevHimIdRef.current = himId;
  }, [himId]);

  // Use the stored previous himId for comparison
  const prevHimId = prevHimIdRef.current;

  useEffect(() => {
    // Check if himId has changed before making API calls
    if (himId !== prevHimId) {
      setChats([]);
    }
  }, [himId, myId, prevHimId, setChats]);

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
  }, [setMyId]);

  useEffect(() => {
    const socket = socketIOClient("http://172.16.151.37:3500");

    socket.on("newChat", async (updatedData) => {
      try {
        const response = await axios.post(
          "http://172.16.151.37:3500/api/chat/getChat",
          { chatId: updatedData }
        );

        const newChat = response.data[0];

        if (
          (newChat.senderId === himId && newChat.receiverId === myId) ||
          (newChat.receiverId === himId && newChat.senderId === myId)
        ) {
          setChats((prevChats) => [newChat, ...prevChats]);
        }
      } catch (err) {}
    });

    return () => {
      socket.disconnect();
    };
  }, [himId, myId, setChats]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await axios.post(
          "http://172.16.151.37:3500/api/user/getUser",
          { userId: himId }
        );

        setUser(userResponse.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUser().then(() => {
      const fetchUser = async () => {
        try {
          const chatResponse = await axios.post(
            "http://172.16.151.37:3500/api/chat/getChats",
            {
              myId,
              himId,
            }
          );

          setChats(chatResponse.data);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      if (myId !== "" && himId !== "") {
        fetchUser();
      }
    });
  }, [himId, myId, setChats]);

  const openFileUploader = () => {
    document.getElementById("image").click();
  };

  const handleSendingImage = (event) => {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      setImage(reader.result);
    };
  };
  useEffect(() => {
    if (image?.length) {
      document.getElementById("sendButton").click();
    }
  }, [image]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (document.getElementById("chatInput").value !== "") {
        sendMessage(e);
        document.getElementById("sendButton").click();
      }
    }
  };

  const handleUserInfo = () => {
    navigate(`/profile/${himId}`)
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const socket = socketIOClient("http://172.16.151.37:3500/");
    try {
      let sendingChat = {};
      if (document.getElementById("chatInput").value !== "") {
        sendingChat = {
          senderId: myId,
          receiverId: himId,
          chatType: "text",
          chat: document.getElementById("chatInput").value,
          timestamp: Date(),
        };
        document.getElementById("chatInput").value = "";
      } else {
        sendingChat = {
          senderId: myId,
          receiverId: himId,
          chatType: "image",
          chat: image,
          timestamp: Date(),
        };
        setImage("");
      }

      const jsonString = JSON.stringify(sendingChat);
      const sizeInBytes = new TextEncoder().encode(jsonString).length;
      console.log(sizeInBytes);
      await axios
        .post("http://172.16.151.37:3500/api/chat/sendChat", sendingChat)
        .then((response) => socket.emit("dataUpdated", response.data))
        .catch((e) => console.log(e));
    } catch (err) {}
  };

  const chatAdapter = chats?.length ? (
    chats.map((c, index) => {
      const senderId = c.senderId;
      const chatType = c.chatType;
      const chat = c.chat;
      const timestamp = c.timestamp;
      return senderId === myId ? (
        <SendedChat
          key={`${index}`}
          senderId={senderId}
          chat={chat}
          chatType={chatType}
          timestamp={timestamp}
        />
      ) : (
        <ReceivedChat
          key={`${index}`}
          senderId={senderId}
          chat={chat}
          chatType={chatType}
          timestamp={timestamp}
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
      <ChattingSectionDiv>
        <Header>
          <UserDetailsDiv>
            <UserProfile
              src={user.profile !== null ? user.profile : __dirname + "profile_default.png"}
            />
            <UserName>{user.username}</UserName>
          </UserDetailsDiv>
          <UserInfo onClick={handleUserInfo}>
            <InfoButton src={__dirname + "ic_info.png"} />
          </UserInfo>
        </Header>
        <Body>{chatAdapter}</Body>
        <Footer>
          <ItemsDiv>
            <ExtraDiv>
              <Extras>
                <ImageUploader
                  type="file"
                  id="image"
                  autoComplete="off"
                  onChange={handleSendingImage}
                />
                <PictureDiv onClick={openFileUploader}>
                  <svg height="40px" viewBox="0 0 36 36" width="40px">
                    <path
                      d="M13.5 16.5a2 2 0 100-4 2 2 0 000 4z"
                      fill="#0a7cff"
                    ></path>
                    <path
                      clipRule="evenodd"
                      d="M7 12v12a4 4 0 004 4h14a4 4 0 004-4V12a4 4 0 00-4-4H11a4 4 0 00-4 4zm18-1.5H11A1.5 1.5 0 009.5 12v9.546a.25.25 0 00.375.217L15 18.803a6 6 0 016 0l5.125 2.96a.25.25 0 00.375-.217V12a1.5 1.5 0 00-1.5-1.5z"
                      fill="#0a7cff"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </PictureDiv>
              </Extras>
            </ExtraDiv>
            <InputChatDiv>
              <InputWidth>
                <InputArea>
                  <InputTextArea
                    type="text"
                    id="chatInput"
                    placeholder="Чат..."
                    autoComplete="none"
                    onKeyDown={handleKeyPress}
                    required
                  ></InputTextArea>
                </InputArea>
                <SendButton id="sendButton" onClick={sendMessage}>
                  <svg height="40px" viewBox="0 0 36 36" width="40px">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#0a7cff"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                      ></path>
                    </svg>
                  </svg>
                </SendButton>
              </InputWidth>
            </InputChatDiv>
          </ItemsDiv>
        </Footer>
      </ChattingSectionDiv>
    </Container>
  );
  return content;
};
export default Chat;
