/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
const StyledNavbar = styled.nav`
  display: block;
  max-width: 4rem;
  height: 100vh;
  top: 0;
  position: sticky;
  width: auto;
  z-index: 50;
`;

const NavDiv = styled.div`
  width: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  border-right: 1px solid gray;
`;

const StyledDiv = styled.div`
  margin-top: 1.5rem;
  cursor: pointer;
`;

const NavItemImage = styled.img`
  z-index: 10;
`;

const ProfileDivImage = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 1px solid gray;
  font-size: 1.3rem;
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  object-position: center center;
`;

const Menu = styled.div`
  background: white;
  border-radius: 0.5rem;
  width: 15rem;
  height: auto;
  position: absolute;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.4);
  display: none;
`;

const MenuItem = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 0.4rem;
  margin: 0.2rem;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const Navbar = () => {
  const { himId } = useParams();
  const [myId, setMyId] = useState("");
  const location = useLocation();
  const [user, setUser] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the menu
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        // If outside, hide the menu
        document.getElementById("menu").style.display = "none";
        setIsMenuOpen(false);
      }
    };

    // Add click event listener to the document
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component is unmounted
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuRef]);

  const navigate = useNavigate();

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
    const fetchUser = async () => {
      try {
        const response = await axios.post(
          "http://172.16.151.37:3500/api/user/getUser",
          { userId: myId }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (myId) {
      fetchUser();
    }
  }, [myId]);

  const isActiveRoute = (routeName) => {
    const pathName = location.pathname;

    return pathName.startsWith(routeName);
  };

  const handleMenu = (e) => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent the click event from propagating to the document click listener
    e.stopPropagation();
  };

  const LogOut = () => {
    Cookies.remove("jwt");
    navigate("/login");
  };

  const Profile = () => {
    navigate(`/profile/${myId}`);
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <StyledNavbar>
      <NavDiv>
        <StyledDiv>
          <ProfileDivImage>
            <ProfileImage
              ref={menuRef}
              width={30}
              src={
                user.profile ? user.profile : __dirname + "profile_default.png"
              }
              onClick={handleMenu}
            />
            <Menu
              ref={menuRef}
              style={{ display: isMenuOpen ? "block" : "none" }}
              id="menu"
            >
              <MenuItem onClick={Profile}>Profile</MenuItem>
              <MenuItem onClick={LogOut}>LogOut</MenuItem>
            </Menu>
          </ProfileDivImage>
        </StyledDiv>
        <StyledDiv className={`${isActiveRoute("/chats") ? "active" : ""}`}>
          {himId?.length ? (
            <Link to={`/chats/${himId}`}>
              <NavItemImage
                width={30}
                src={
                  isActiveRoute("/chats")
                    ? __dirname + "ic_chat_active.png"
                    : __dirname + "ic_chat.png"
                }
              />
            </Link>
          ) : (
            <Link to="/chats">
              <NavItemImage
                width={30}
                src={
                  isActiveRoute("/chats")
                    ? __dirname + "ic_chat_active.png"
                    : __dirname + "ic_chat.png"
                }
              />
            </Link>
          )}
        </StyledDiv>
        <StyledDiv className={`${isActiveRoute("/contacts") ? "active" : ""}`}>
          {himId?.length ? (
            <Link to={`/contacts/${himId}`}>
              <NavItemImage
                width={30}
                src={
                  isActiveRoute("/contacts")
                    ? __dirname + "ic_contact_active.png"
                    : __dirname + "ic_contact.png"
                }
              />
            </Link>
          ) : (
            <Link to="/contacts">
              <NavItemImage
                width={30}
                src={
                  isActiveRoute("/contacts")
                    ? __dirname + "ic_contact_active.png"
                    : __dirname + "ic_contact.png"
                }
              />
            </Link>
          )}
        </StyledDiv>
      </NavDiv>
    </StyledNavbar>
  );
};
export default Navbar;
