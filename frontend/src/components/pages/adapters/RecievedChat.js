import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import ImageFullScreen from "./ImageFullScreen"

const ReceiverChatDiv = styled.div`
  width: auto;
  display: flex;
  flex: 1;
  justify-content: start;
  align-items: center;
  padding: 0.3rem 0.5rem;
`;

const ReceiverChat = styled.div`
  background-color: #f0f2f5;
  display: flex;
  padding: 0.5rem;
  border-radius: 1rem;
`;

const TimestampReceiver = styled.div`
  display: none;
  margin-left: 0.5rem;

  & div {
    max-height: 2rem;
    background-color: darkgray;
    padding: 0.3rem 0.5rem;
    align-items: center;
    border-radius: 0.5rem;
  }
`;

const UserProfileInChat = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  margin-right: 0.4rem;
`;

const ReceiverChatSect = styled.div`
  display: flex;
  &:hover .timestamp {
    display: flex;
    align-items: center;
  }
`;

const ImageSect = styled.div`
  display: flex;
  border-radius: 1rem;
  max-width: 25rem;
  height: auto;
  cursor: pointer;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border-radius: 1rem;
`;

const ReceivedChat = ({ senderId, chat, chatType, timestamp }) => {
  const [user, setUser] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const changeTimeFormat = (TimeStamp) => {
    const dateObject = new Date(TimeStamp);
    const d = dateObject.toString().split(" ");
    const t = d[4].split(":");
    return "" + d[1] + " " + d[2] + " " + t[0] + ":" + t[1];
  };

  
  const fullScreen = () => {
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      console.log("Sender ID:", senderId);
      try {
        const userResponse = await axios.post(
          "http://172.16.151.37:3500/api/user/getUser",
          { userId: senderId }
        );
        setUser(userResponse.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUser();
  }, [senderId]);

  return (
    <ReceiverChatDiv>
      <UserProfileInChat
        src={user.profile !== null ? user.profile : __dirname + "profile_default.png"}
      />
      <ReceiverChatSect>
        {chatType === "text" ? (
          <ReceiverChat>{chat}</ReceiverChat>
        ) : (
          <ImageSect onClick={fullScreen}>
            <Image src={chat} />
          </ImageSect>
        )}
        <TimestampReceiver className="timestamp">
          <div>{changeTimeFormat(timestamp)}</div>
        </TimestampReceiver>
      </ReceiverChatSect>
      {isFullScreen && (
        <ImageFullScreen imageUrl={chat} closeFullScreen={closeFullScreen} />
      )}
    </ReceiverChatDiv>
  );
};

export default ReceivedChat;
