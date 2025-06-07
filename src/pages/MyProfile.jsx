import { useEffect, useState, useRef } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import "./MyProfile.css";

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const alertShown = useRef(false);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile/me");
        setProfile(res.data);
      } catch (err) {
        if (!alertShown.current) {
          alert("Profile not found");
          alertShown.current = true;
        }
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <p>No profile found. Please create your profile.</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>
      {profile.imageUrl && (
        <div className="profile-image-wrapper">
          <img
            src={`http://localhost:5000${profile.imageUrl}`}
            alt="Profile"
            className="profile-image"
          />
        </div>
      )}

      <p><strong>Bio:</strong><br></br> {profile.bio}</p>
      <p><strong>Skills:</strong> <br></br>{profile.skills.join(", ")}</p>
      <p>
        <strong>GitHub:</strong>{" "}<br></br>
        <a href={profile.social?.github} target="_blank" rel="noopener noreferrer">
          {profile.social?.github}
        </a>
      </p>
      <p>
        <strong>LinkedIn:</strong>{" "}<br></br>
        <a href={profile.social?.linkedin} target="_blank" rel="noopener noreferrer">
          {profile.social?.linkedin}
        </a>
      </p>
      <p>
        <strong>Twitter:</strong>{" "}<br></br>
        <a href={profile.social?.twitter} target="_blank" rel="noopener noreferrer">
          {profile.social?.twitter}
        </a>
      </p>
      <Link to="/home/edit-profile" className="edit-link">Edit Profile</Link>
    </div>
  );
}
