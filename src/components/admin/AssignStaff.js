import React, { useEffect, useState } from "react";
import userService from "../../services/userService";
import "./AssignStaff.css";

const AssignStaff = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService
      .getUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAssignStaff = async (userId) => {
    try {
      await userService.assignStaffRole(userId);
      alert("Staff role assigned successfully!");
      // Optionally update UI to reflect new role
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: "staff" } : user
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to assign staff role."
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!users.length) return <div>No users found.</div>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Assign Staff Role</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>{user.role}</td>
              <td>
                {user.role !== "staff" && (
                  <button onClick={() => handleAssignStaff(user.id)}>
                    Make Staff
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignStaff;