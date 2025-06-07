import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState("users");

  const token = localStorage.getItem("token");

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users");
    }
  }, [token]);

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get("/admin/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch posts");
    }
  }, [token]);

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== id));
      alert("User deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  // Delete post
  const deletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/post/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post._id !== id));
      alert("Post deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Error deleting post");
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Switch view handler
  const handleViewChange = (newView) => {
    setView(newView);
    if (newView === "users") fetchUsers();
    else if (newView === "posts") fetchPosts();
  };

  return (
    <div className="admin-panel-container">
      <h1 className="admin-panel-title">Admin Panel</h1>

      <div className="view-buttons">
        <button
          className={view === "users" ? "active" : ""}
          onClick={() => handleViewChange("users")}
        >
          Users
        </button>
        <button
          className={view === "posts" ? "active" : ""}
          onClick={() => handleViewChange("posts")}
        >
          Posts
        </button>
      </div>

      {view === "users" && (
        <>
          {users.length === 0 ? (
            <p className="no-users-text">No users found</p>
          ) : (
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th className="action-column">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="table-row">
                      <td className="name-cell">{user.name}</td>
                      <td className="email-cell">{user.email}</td>
                      <td className="action-cell">
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {view === "posts" && (
        <>
          {posts.length === 0 ? (
            <p className="no-posts-text">No posts found</p>
          ) : (
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Post Text</th>
                    <th>Author</th>
                    <th>Date</th>
                    <th className="action-column">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post._id} className="table-row">
                      <td className="post-text-cell">{post.text}</td>
                      <td className="author-cell">{post.name}</td>
                      <td className="date-cell">
                        {new Date(post.date).toLocaleString()}
                      </td>
                      <td className="action-cell">
                        <button
                          onClick={() => deletePost(post._id)}
                          className="delete-button"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPanel;
