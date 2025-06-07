import  { useEffect, useState } from "react";
import axios from "axios";
import CommentForm from "../components/CommentForm";
import "./Posts.css";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts", config);
      setPosts(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  fetchPosts();
}, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text) return alert("Please enter text");
    try {
      const body = JSON.stringify({ text });
      const res = await axios.post("http://localhost:5000/api/posts", body, config);
      setPosts([res.data, ...posts]);
      setText("");
    } catch (err) {
      console.error(err);
      alert("Error creating post");
    }
  };

  const likePost = async (postId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/posts/like/${postId}`, {}, config);
      setPosts(posts.map(post => post._id === postId ? { ...post, likes: res.data } : post));
    } catch (err) {
      console.error(err);
    }
  };

  const unlikePost = async (postId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/posts/unlike/${postId}`, {}, config);
      setPosts(posts.map(post => post._id === postId ? { ...post, likes: res.data } : post));
    } catch (err) {
      console.error(err);
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, config);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (err) {
      console.error(err);
      alert("you delete only your posts");
    }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading posts...</div>;

  return (
    <div className="posts-container">
      <h1 className="posts-title">Posts</h1>

      <form onSubmit={onSubmit} className="post-form">
        <textarea
          className="post-textarea"
          placeholder="Write a new post..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="4"
        />
        <button type="submit" className="post-submit-button">Post</button>
      </form>

      {posts.length === 0 ? (
        <p className="no-posts-msg">No posts found</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="post-card">
            <h2 className="post-text">{post.text}</h2>
            <h6 className="post-author">Posted by: {post.name}</h6>
            <small className="post-date">Posted on: {new Date(post.date).toLocaleString()}</small>
            <div className="post-actions">
              <button onClick={() => likePost(post._id)} className="like-btn">👍 Like ({post.likes.length})</button>
              <button onClick={() => unlikePost(post._id)} className="unlike-btn">👎 Unlike</button>
              <button onClick={() => deletePost(post._id)} className="delete-btn">🗑 Delete</button>
            </div>

            {post.comments && post.comments.length > 0 && (
              <div className="comments-section">
                <h4 className="comments-title">Comments:</h4>
                {post.comments.map((comment) => (
                  <div key={comment._id} className="comment-item">
                   
                    <h3>{comment.text}</h3>
                    <h6 className="comment-author">Commented by: {comment.name}</h6>
                    <small className="comment-date">{new Date(comment.date).toLocaleString()}</small>
                  </div>
                ))}
              </div>
            )}

            <CommentForm
              postId={post._id}
              onNewComment={(newComment) =>
                setPosts(posts.map(p => p._id === post._id
                  ? { ...p, comments: [newComment, ...(p.comments || [])] }
                  : p))
              }
            />
          </div>
        ))
      )}
    </div>
  );
};

export default Posts;
