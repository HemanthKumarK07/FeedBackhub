import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Table, Button, Badge, Spinner } from 'react-bootstrap';
import { FaTrash, FaUserCog, FaUser, FaUserShield } from 'react-icons/fa';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAuthHeader, user: currentUser } = useAuth();

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get('/api/admin/users', getAuthHeader());
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader]);

  const handleRoleChange = async (userId, newRole) => {
    if (window.confirm(`Change role to ${newRole}?`)) {
      await axios.put(`/api/admin/users/${userId}/role`, { role: newRole }, getAuthHeader());
      fetchUsers();
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Delete user and all their feedback?')) {
      await axios.delete(`/api/admin/users/${userId}`, getAuthHeader());
      fetchUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <div className="text-center"><Spinner animation="border" variant="primary" /></div>;

  return (
    <div className="bg-dark p-4 rounded-4 shadow">
      <h4 className="mb-3 text-white">👥 Registered Users</h4>
      <Table responsive striped hover className="text-white">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td><div className="d-flex align-items-center gap-2">{user.role === 'admin' ? <FaUserShield className="text-primary" /> : <FaUser />} {user.name}</div></td>
              <td>{user.email}</td>
              <td><Badge bg={user.role === 'admin' ? 'primary' : 'secondary'}>{user.role}</Badge></td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <div className="d-flex gap-2">
                  {user.role === 'user' ? (
                    <Button variant="outline-primary" size="sm" onClick={() => handleRoleChange(user._id, 'admin')}><FaUserCog /> Make Admin</Button>
                  ) : (
                    <Button variant="outline-warning" size="sm" onClick={() => handleRoleChange(user._id, 'user')}><FaUser /> Remove Admin</Button>
                  )}
                  {user._id !== currentUser?.id && (
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteUser(user._id)}><FaTrash /> Delete</Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UsersList;