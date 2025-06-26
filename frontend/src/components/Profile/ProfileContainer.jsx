// components/Profile/ProfileContainer.jsx
import React from "react";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import "./Profile.css";

const ProfileContainer = () => {
  return (
    <div className="profile-container">
      <LeftPanel />
      <RightPanel />
    </div>
  );
};

export default ProfileContainer;
