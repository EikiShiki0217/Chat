import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { memo, useEffect, useState } from "react";

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

const User = ({ userId }) => {
  const [user, setUser] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
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

    fetchUser();
  }, [userId]);

  if (user) {
    const handleEdit = () => navigate(`/contacts/${userId}`);

    return (
      <UserDiv onClick={handleEdit}>
        <UserProfile src={user.profile !== null ? user.profile : __dirname + "profile_default.png"} />
        {user.username}
      </UserDiv>
    );
  } else return null;
};

const memoizedUser = memo(User);

export default memoizedUser;
