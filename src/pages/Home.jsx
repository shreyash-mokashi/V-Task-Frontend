import React from "react";
import { NavLink, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import ProfileForm from "./ProfileForm";
import MyProfile from "./MyProfile";
import Posts from "./Posts";
import SearchProfiles from "./SearchProfiles";
import AdminPanel from "./AdminPanel";

import "./Home.css";

export default function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.isAdmin;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="home-container">
      <div className="home-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="home-title">Welcome..!</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <h2 className="user-name">{user?.name}</h2>

      <p className="home-subtitle">
        You are logged in as <strong>{isAdmin ? "Admin" : "User"}</strong>.
      </p>

      <nav className="home-nav">
        <NavLink
          to="/home/my-profile"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          My Profile
        </NavLink>
        <NavLink
          to="/home/edit-profile"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Edit Profile
        </NavLink>
        <NavLink
          to="/home/posts"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Posts
        </NavLink>
        <NavLink
          to="/home/search"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Search Profiles
        </NavLink>
        {isAdmin && (
          <NavLink
            to="/home/admin"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Admin Panel
          </NavLink>
        )}
      </nav>

      <div className="home-content">
        <Routes>
          <Route path="/" element={<Navigate to="/home/my-profile" />} />
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="edit-profile" element={<ProfileForm />} />
          <Route path="posts" element={<Posts />} />
          <Route path="search" element={<SearchProfiles />} />
          {isAdmin && <Route path="admin" element={<AdminPanel />} />}
        </Routes>
      </div>
    </div>
  );
}
