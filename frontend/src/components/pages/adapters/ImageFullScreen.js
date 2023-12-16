import React from "react";
import styled from "styled-components";

const FullScreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ExitButtonDiv = styled.div`
    width: 5rem;
    height: 5rem;
    display: block;
    cursor: pointer;
    position: absolute;
    top: 0.5rem;
    right: 0.8rem;
`

const ExitButton = styled.img`
    width: 100%;
`;

const FullScreenImage = styled.img`
  max-width: 80%;
  max-height: 80%;
`;

const ImageFullScreen = ({ imageUrl, closeFullScreen }) => {
  return (
    <FullScreenOverlay>
      <ExitButtonDiv onClick={closeFullScreen}>
        <ExitButton src={__dirname + "ic_exit.png"}/>
      </ExitButtonDiv>
      <FullScreenImage src={imageUrl} alt="Full Screen" />
    </FullScreenOverlay>
  );
};

export default ImageFullScreen;
