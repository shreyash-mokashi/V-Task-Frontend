import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import "./ProfileForm.css";

const API_BASE_URL = "https://v-task-backend.onrender.com/api";

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skills: "",
    github: "",
    linkedin: "",
    twitter: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData({
          name: res.data.name || "",
          bio: res.data.bio || "",
          skills: res.data.skills?.join(", ") || "",
          github: res.data.social?.github || "",
          linkedin: res.data.social?.linkedin || "",
          twitter: res.data.social?.twitter || "",
          imageUrl: res.data.imageUrl || "",
        });
      } catch (err) {
        setMessage("No profile found. Create one.");
      }
    };

    fetchProfile();
  }, []);

  const validateField = (name, value) => {
    if (name === "name") {
      const namePattern = /^[A-Za-z\s]+$/;
      if (!value) return "Name is required.";
      if (!namePattern.test(value)) {
        return "Name must contain only letters (no numbers or symbols).";
      }
    }

    if (["github", "linkedin", "twitter"].includes(name)) {
      if (value.trim() !== "") {
        const urlPattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
        if (!urlPattern.test(value)) {
          return "Please enter a valid URL (must start with http:// or https://)";
        }
      }
    }

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Live validation per field
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation before submit
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const errorMsg = validateField(field, formData[field]);
      if (errorMsg) {
        newErrors[field] = errorMsg;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      let uploadedImageUrl = formData.imageUrl;

      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);

        setUploading(true);
        const uploadRes = await axios.post(
          `${API_BASE_URL}/api/profile/upload`,
          imageFormData,
          {
            headers: {
              ...headers,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setUploading(false);
        uploadedImageUrl = uploadRes.data.imageUrl;
      }

      const profileData = {
        name: formData.name,
        bio: formData.bio,
        skills: formData.skills,
        github: formData.github,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        imageUrl: uploadedImageUrl,
      };

      await axios.post(`${API_BASE_URL}/api/profile`, profileData, {
        headers,
      });

      toast.success("Profile updated successfully!");
      setFormData({ ...formData, imageUrl: uploadedImageUrl });
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
      setUploading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Edit Profile</h2>
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <label className="label" htmlFor="name">
          Name
        </label>
        <input
          className={`input ${errors.name ? "inputInvalid" : ""}`}
          type="text"
          id="name"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        {errors.name && <div className="field-error">{errors.name}</div>}

        <label className="label" htmlFor="bio">
          Bio
        </label>
        <textarea
          className="textarea"
          id="bio"
          name="bio"
          placeholder="Short Bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
        />

        <label className="label" htmlFor="skills">
          Skills (comma separated)
        </label>
        <input
          className="input"
          type="text"
          id="skills"
          name="skills"
          placeholder="JavaScript, React, Node.js"
          value={formData.skills}
          onChange={handleChange}
        />

        <label className="label" htmlFor="github">
          GitHub
        </label>
        <input
          className={`input ${errors.github ? "inputInvalid" : ""}`}
          type="text"
          id="github"
          name="github"
          placeholder="GitHub profile URL"
          value={formData.github}
          onChange={handleChange}
        />
        {errors.github && <div className="field-error">{errors.github}</div>}

        <label className="label" htmlFor="linkedin">
          LinkedIn
        </label>
        <input
          className={`input ${errors.linkedin ? "inputInvalid" : ""}`}
          type="text"
          id="linkedin"
          name="linkedin"
          placeholder="LinkedIn profile URL"
          value={formData.linkedin}
          onChange={handleChange}
        />
        {errors.linkedin && <div className="field-error">{errors.linkedin}</div>}

        <label className="label" htmlFor="twitter">
          Twitter
        </label>
        <input
          className={`input ${errors.twitter ? "inputInvalid" : ""}`}
          type="text"
          id="twitter"
          name="twitter"
          placeholder="Twitter profile URL"
          value={formData.twitter}
          onChange={handleChange}
        />
        {errors.twitter && <div className="field-error">{errors.twitter}</div>}

        <label className="label" htmlFor="imageUpload">
          Profile Image
        </label>
        <input
          id="imageUpload"
          className="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
        />

        {uploading && <p className="uploadingText">Uploading image...</p>}

        {formData.imageUrl && (
          <div className="imgPreviewContainer">
            <img
              src={`${API_BASE_URL}${formData.imageUrl}`}
              alt="Profile"
              className="imgPreview"
            />
          </div>
        )}

        <button className="button" type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
