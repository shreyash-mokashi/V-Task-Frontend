import React, { useState } from "react";
import axios from "axios";

import "./CommentForm.css";

const CommentForm = ({ postId, onNewComment }) => {
  const [text, setText] = useState("");
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!text) return alert("Please enter a comment");

    try {
      const body = JSON.stringify({ text });
      const res = await axios.post(
        `https://v-task-backend.onrender.com/api/posts/comment/${postId}`,
        body,
        config
      );
      onNewComment(res.data);
      setText("");
    } catch (err) {
      console.error(err);
      alert("Error adding comment");
    }
  };

  return (
    <form onSubmit={submitComment} className="commentForm">
      <input
        type="text"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="commentInput"
      />
      <button type="submit" className="commentButton">
        Add Comment
      </button>
    </form>
  );
};

export default CommentForm;
