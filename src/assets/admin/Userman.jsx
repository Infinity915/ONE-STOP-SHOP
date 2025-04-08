import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:2100";

function Userman() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    if (!token) {
      console.error("❌ No token found! User is not authenticated.");
      setRedirect(true);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("❌ Error fetching users:", error.response?.data || error);
      if (error.response?.status === 401) {
        setRedirect(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!token) return;

    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    setActionLoading(true);

    try {
      await axios.delete(`${API_BASE_URL}/api/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ User deleted successfully");
      fetchUsers(); // refetch list
    } catch (error) {
      console.error("❌ Error deleting user:", error.response?.data || error);
      alert("❌ Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditUserId(user._id);
    setEditRole(user.role);
  };

  const handleUpdateRole = async (id) => {
    if (!token) return;

    setActionLoading(true);

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/auth/users/${id}/role`, // ✅ Corrected endpoint
        { role: editRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("✅ Role updated successfully");

      setEditUserId(null);
      fetchUsers(); // refresh updated list
    } catch (error) {
      console.error("❌ Error updating role:", error.response?.data || error);
      alert("❌ Failed to update role");
    } finally {
      setActionLoading(false);
    }
  };

  if (redirect) return <Navigate to="/signin" />;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>👥 User Management</h2>

      {loading ? (
        <p style={styles.info}>Loading users...</p>
      ) : users.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>
                  {editUserId === user._id ? (
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      style={styles.select}
                    >
                      <option value="0">User</option>
                      <option value="1">Admin</option>
                    </select>
                  ) : user.role === 1 ? "Admin" : "User"}
                </td>
                <td style={styles.td}>
                  {editUserId === user._id ? (
                    <button
                      onClick={() => handleUpdateRole(user._id)}
                      style={styles.saveBtn}
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Saving..." : "Save"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditClick(user)}
                      style={styles.editBtn}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user._id)}
                    style={styles.deleteBtn}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={styles.info}>No users found.</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "28px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
  },
  th: {
    padding: "12px",
    backgroundColor: "#f4f4f4",
    borderBottom: "1px solid #ccc",
    textAlign: "left",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
  },
  select: {
    padding: "5px 10px",
    fontSize: "14px",
  },
  editBtn: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    marginRight: "8px",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  saveBtn: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    marginRight: "8px",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteBtn: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  info: {
    textAlign: "center",
    fontSize: "18px",
    color: "#666",
  },
};

export default Userman;
