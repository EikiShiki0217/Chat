import styled from "styled-components";

const Container = styled.div`
  display: Block;
  flex-direction: row;
  height: 100vh;
  max-height: 100vh;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
`;

const ChattingSectionDiv = styled.div`
  display: block;
  height: 100vh;
  max-height: 100vh;
  width: 40rem;
  border-right: 1px solid gray;
`;

const NoChatDiv = styled.div`
  width: auto;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NoChatItems = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 20rem;
  height: 20rem;
`;

const NoChatImage = styled.img`
  width: 12rem;
`;

const NoChatLabel = styled.div`
margin-top: 2rem;   
font-size: 2rem
`;

const Chat = () => {
  const content = (
    <Container>
      <ChattingSectionDiv>
        <NoChatDiv>
          <NoChatItems>
            <NoChatImage src="./no_chat.png" />
            <NoChatLabel>Харилцагч алга</NoChatLabel>
          </NoChatItems>
        </NoChatDiv>
      </ChattingSectionDiv>
      <div></div>
    </Container>
  );
  return content;
};
export default Chat;
