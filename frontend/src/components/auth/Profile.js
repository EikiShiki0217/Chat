import styled from "styled-components";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Edit from "./Edit";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  margin: 0 2rem;
  max-height: 100vh;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const CoverSect = styled.div`
  width: 100%;
  position: relative;
`;
const Cover = styled.img`
  display: flex;
  background: gray;
  width: 100%;
  height: 25rem;
  object-fit: cover;
  object-position: center center;
`;

const Details = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  box-shadow: 0px 4px 6px 0 rgba(0, 0, 0, 0.5);
  height: 7rem;
`;

const ProfileSect = styled.div`
  bottom: 1rem;
  left: 0;
  top: -7rem;
  position: absolute;
`;

const ProfDiv = styled.div`
  position: relative;
  width: 15rem;
  display: flex;
`;

const NameDiv = styled.div`
  position: relative;
  height: 7rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProfileDiv = styled.div`
  width: 13rem;
  height: 13rem;
  position: relative;
  padding: 0.2rem;
  background: white;
  border-radius: 50%;
  font-size: 1.3rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: inset 0 0 0 2px gray;
  object-position: center center;
`;

const Name = styled.div`
  margin: 0 2.4rem;

  & p {
    font-size: 2.3rem;
  }
`;

const CoverInput = styled.input`
  position: absolute;
  width: 0px;
`;

const CoverInputDiv = styled.div`
  background: rgba(0, 0, 0, 0.7);
  border-radius: 1rem;
  position: absolute;
  display: flex;
  width: 2.5rem;
  align-items: center;
  padding-left: 0.5rem;
  right: 1rem;
  bottom: 1rem;
  height: 2.5rem;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  transition: width 0.5s ease-in-out;

  &:hover {
    width: 9.7rem;
    background: rgba(0, 0, 0, 1);
  }

  & div {
    margin: 0 0.5rem;
    color: white;
    font-size: 1.3rem;
  }
`;

const CoverUploadImg = styled.img`
  width: 2rem;
  height: 2rem;
`;

const ProfileImageUploadDiv = styled.div`
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  display: flex;
  width: 2.5rem;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  position: absolute;
  bottom: 0.6rem;
  right: 0.6rem;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  transition: width 0.5s ease-in-out;
`;

const ProfileImageUploadImg = styled.img`
  width: 2rem;
  height: 2rem;
`;

const ProfileImageInput = styled.input`
  width: 0;
  position: absolute;
`;

const Info = styled.div`
  margin: 0 4rem;
  height: 7rem;
  background: white;
  position: relative;
  display: flex;
  flex-ridection: row;
  box-shadow: -0.4px 4px 4px 0 rgba(0, 0, 0, 0.4),
    0.4px 4px 4px 0 rgba(0, 0, 0, 0.4);
`;

const InfoItems = styled.div`
  width: calc(100% / 3);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const InfoLabel = styled.label`
  font-size: 1rem;
`;

// const InfoInput = styled.input`
//   font-size: 1rem;
//   padding: 0.5rem;
//   border: 0.4px solid gray;
//   border-radius: 0.5rem;
// `;

const EditButtonDiv = styled.div`
  height: 7rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 2.4rem;

  &:hover div {
    background: #0a7cff;
  }
`;

const DetailsDiv = styled.div`
  width: 100%;
  height: 7rem;
  position: relative;
  display: flex;
  flex-direction: row;
  margin: 0 4rem;
`;

const EditButton = styled.div`
  cursor: pointer;
  width: 10rem;
  background: #0a7cff;
  color: white;
  height: 3rem;
  font-size: 1.5rem;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState([]);
  const [myId, setMyId] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.post(
          "http://172.16.151.37:3500/api/user/getUser",
          { userId }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

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
  }, []);

  const addCover = (event) => {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = async () => {
      try {
        await axios.post("http://172.16.151.37:3500/api/user/uploadCover", {
          cover: reader.result,
          userId,
        });
        document.getElementById("profileUpload").value = null;
        window.location.reload();
      } catch (error) {
        uploadProfile(event);
      }
    };
  };

  const uploadProfile = (event) => {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = async () => {
      try {
        await axios.post("http://172.16.151.37:3500/api/user/uploadProfile", {
          profile: reader.result,
          userId,
        });

        document.getElementById("profileUpload").value = null;
        window.location.reload();
      } catch (error) {
        uploadProfile(event);
      }
    };
  };

  const openCoverUpload = () => {
    document.getElementById("coverInput").click();
  };

  const openProfileUpload = () => {
    document.getElementById("profileUpload").click();
  };

  const content = (
    <Container>
      <Header>
        <CoverSect>
          <Cover src={user.cover ? user.cover : null} />
          <CoverInput
            type="file"
            id="coverInput"
            onChange={addCover}
            autoComplete="off"
          />
          <CoverInputDiv
            style={
              myId !== user._id ? { display: "none" } : { display: "flex" }
            }
            onClick={openCoverUpload}
          >
            <CoverUploadImg src={__dirname + "ic_add_image.png"} />
            <div>Зураг солих</div>
          </CoverInputDiv>
        </CoverSect>
        <Details>
          <DetailsDiv>
            <ProfDiv>
              <ProfileSect>
                <ProfileDiv>
                  <ProfileImage
                    src={
                      user.profile
                        ? user.profile
                        : __dirname + "profile_default.png"
                    }
                  />
                  <ProfileImageUploadDiv
                    style={
                      myId !== user._id
                        ? { display: "none" }
                        : { display: "flex" }
                    }
                    onClick={openProfileUpload}
                  >
                    <ProfileImageUploadImg
                      src={__dirname + "ic_add_image.png"}
                    />
                  </ProfileImageUploadDiv>
                </ProfileDiv>
              </ProfileSect>
            </ProfDiv>
            <ProfileImageInput
              type="file"
              id="profileUpload"
              onChange={uploadProfile}
              autoComplete="off"
            />
            <NameDiv>
              <Name>
                <p>{user.username}</p>
              </Name>
              <EditButtonDiv
                style={
                  myId !== user._id ? { display: "none" } : { display: "flex" }
                }
              >
                <EditButton onClick={() => setIsEdit(!isEdit)}>
                  Засварлах
                </EditButton>
              </EditButtonDiv>
            </NameDiv>
          </DetailsDiv>
        </Details>
        <Info>
          <InfoItems>
            <InfoLabel></InfoLabel>
            <InfoLabel></InfoLabel>
          </InfoItems>
          <InfoItems>
            <InfoLabel></InfoLabel>
            <InfoLabel></InfoLabel>
          </InfoItems>
          <InfoItems>
            <InfoLabel></InfoLabel>
            <InfoLabel></InfoLabel>
          </InfoItems>
        </Info>
      </Header>
      {isEdit && <Edit myId={myId} setIsEdit={setIsEdit} />}
    </Container>
  );
  return content;
};

export default Profile;
