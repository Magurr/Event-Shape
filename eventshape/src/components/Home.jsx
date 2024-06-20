import React from "react";
import Event from "./Event";
import EventShow from "./EventShow";
import PostShow from "./PostShow";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsersRays, faClipboard } from "@fortawesome/free-solid-svg-icons";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import avatarImage from "/public/erkek_1.jpg";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "firebase/storage";
function Home() {
  const firebaseConfig = {
    apiKey: "AIzaSyBJBTwygFE0hewlg_IBIDADjEBFIpSzQ28",
    authDomain: "event-shape.firebaseapp.com",
    projectId: "event-shape",
    storageBucket: "event-shape.appspot.com",
    messagingSenderId: "106516300464",
    appId: "1:106516300464:web:8c7c9e0cb0af3ef9c7b175",
    measurementId: "G-4CLFTMTGFF",
  };

  const [activeTab, setActiveTab] = useState("event");
  const [isEventOpen, setisEventOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const settings = ["Profile", "Account", "Dashboard", "Logout"];

  const [profilePicUrl, setProfilePicUrl] = useState("");

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const openEvent = () => {
    setisEventOpen(true);
  };
  const closeEvent = () => {
    setisEventOpen(false);
  };
  const submitEvent = () => {
    setisEventOpen(false);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // const handleProfileImage = async () => {
  //   try {
  //     const userRef = collection(db, "users"); // Kullanıcı koleksiyonu referansı
  //     const snapshot = await getDocs(userRef);

  //     snapshot.forEach((doc) => {
  //       const userData = doc.data();
  //       if (userData.userName === localStorage.getItem("loggedUser")) {

  //         return;
  //       }
  //     });
  //   } catch {}
  // };
  useEffect(() => {
    // localStorage'dan userId'yi al
    const currentUser = localStorage.getItem("loggedUser");
    if (currentUser) {
      // Firebase Storage referansını oluştur
      const profilePicFolderRef = ref(storage, `images/${currentUser}/ppimage`);

      // Dosya URL'sini al
      listAll(profilePicFolderRef)
        .then((res) => {
          if (res.items.length > 0) {
            // Assuming there's only one file in the folder
            getDownloadURL(res.items[0])
              .then((url) => {
                setProfilePicUrl(url);
              })
              .catch((error) => {
                console.error("Error fetching profile picture URL:", error);
              });
          } else {
            console.error("No files found in the specified folder.");
          }
        })
        .catch((error) => {
          console.error("Error listing folder contents:", error);
        });
    }
  }, [localStorage.getItem("loggedUser")]);

  return (
    <div className="maindiv">
      <div className="tab">
        <button
          className={activeTab === "event" ? "tablinks active" : "tablinks"}
          onClick={() => handleTabChange("event")}
        >
          Events
        </button>
        <button
          className={activeTab === "post" ? "tablinks active" : "tablinks"}
          onClick={() => handleTabChange("post")}
        >
          Posts
        </button>
        <div className="userMenuList">
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="User Avatar" src={profilePicUrl} />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>
      <div className="creatediv">
        <a href="#" className="createButton" onClick={openEvent}>
          <FontAwesomeIcon icon={faUsersRays} size="2x" />
        </a>

        <a href="#" className="createButton">
          <FontAwesomeIcon icon={faClipboard} size="2x" />
        </a>
      </div>
      <div className="createEvent">
        {/* {isEventOpen ? (
          <Event openEvent={openEvent} submitEvent={submitEvent} />
        ) : null} */}
        {/* {isEventOpen ? (
          <Event
            // openEvent={openEvent}
            submitEvent={submitEvent}
            isEventOpen={isEventOpen}
            closeEvent={closeEvent}
          />
        ) : null} */}
        <Event
          openEvent={openEvent}
          submitEvent={submitEvent}
          isEventOpen={isEventOpen}
          closeEvent={closeEvent}
        />
      </div>

      <div className="tabcontent">
        {activeTab === "event" ? <EventShow /> : null}
        {activeTab === "post" ? <PostShow /> : null}
      </div>
    </div>
  );
}

export default Home;
