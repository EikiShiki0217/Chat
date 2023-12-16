import styled from "styled-components";
import ImageFullScreen from "./ImageFullScreen"
import { useState } from "react";

const SenderChatDiv = styled.div`
  width: auto;
  display: flex;
  flex: 1;
  justify-content: end;
  align-items: center;
  padding: 0.3rem 0.5rem;
`;

const SenderChatSect = styled.div`
  display: flex;
  justify-content: end;
  &:hover .timestamp {
    display: flex;
    align-items: center;
  }
`;

const TimestampSender = styled.div`
  display: none;
  margin-right: 0.5rem;
  & div {
    max-height: 2rem;
    background-color: darkgray;
    padding: 0.3rem 0.5rem;
    align-items: center;
    border-radius: 0.5rem;
  }
`;

const SenderChat = styled.div`
  background-color: rgb(10, 124, 255);
  color: white;
  display: flex;
  padding: 0.5rem;
  border-radius: 1rem;
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

const SendedChat = ({ chat, chatType, timestamp }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  function changeTimeFormat(TimeStamp) {
    const dateObject = new Date(TimeStamp);
    const d = dateObject.toString().split(" ");
    const t = d[4].split(":");
    return "" + d[1] + " " + d[2] + " " + t[0] + ":" + t[1];
  }

  const fullScreen = () => {
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  return chatType === "text" ? (
    <div>
      <SenderChatDiv alt="asd">
        <SenderChatSect>
          <TimestampSender className="timestamp">
            <div>{changeTimeFormat(timestamp)}</div>
          </TimestampSender>
          <SenderChat>{chat}</SenderChat>
        </SenderChatSect>
      </SenderChatDiv>
    </div>
  ) : (
    <div>
      <SenderChatDiv alt="asd">
        <SenderChatSect>
          <TimestampSender className="timestamp">
            <div>{changeTimeFormat(timestamp)}</div>
          </TimestampSender>
          <ImageSect onClick={fullScreen}>
            <Image src={chat} />
          </ImageSect>
        </SenderChatSect>
        {isFullScreen && (
          <ImageFullScreen imageUrl={chat} closeFullScreen={closeFullScreen} />
        )}
      </SenderChatDiv>
    </div>
  );
};

export default SendedChat;
