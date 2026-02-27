import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import UserTable from '../../components/admin/UserTable';
import Modal from '../../components/common/Modal';
import api from '../../services/api';

const UserManagement = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      setUsers(response.data.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDelete = async (userToDelete) => {
    if (!window.confirm(`Are you sure you want to delete ${userToDelete.email}?`)) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userToDelete._id}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleBanToggle = async (userToToggle) => {
    const action = userToToggle.isBanned ? 'unban' : 'ban';
    if (!window.confirm(`Are you sure you want to ${action} ${userToToggle.email}?`)) {
      return;
    }

    try {
      await api.patch(`/admin/users/${userToToggle._id}/${action}`);
      toast.success(`User ${action}ned successfully`);
      fetchUsers();
    } catch (error) {
      console.error(`Error ${action}ning user:`, error);
      toast.error(`Failed to ${action} user`);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={logout} />

      <div className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage platform users and their permissions</p>
          </div>

          {/* User Table */}
          <UserTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBanToggle={handleBanToggle}
            loading={loading}
          />
        </div>
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <Modal isOpen={showModal} onClose={handleModalClose} title="User Details">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{selectedUser.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <p className="text-gray-900 capitalize">{selectedUser.role}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <p className="text-gray-900">
                {selectedUser.isBanned
                  ? 'Banned'
                  : selectedUser.isEmailVerified
                  ? 'Active'
                  : 'Unverified'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Joined</label>
              <p className="text-gray-900">
                {new Date(selectedUser.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="pt-4 border-t flex gap-3">
              <button
                onClick={() => {
                  handleBanToggle(selectedUser);
                  handleModalClose();
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                  selectedUser.isBanned
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                {selectedUser.isBanned ? 'Unban User' : 'Ban User'}
              </button>
              <button
                onClick={() => {
                  handleDelete(selectedUser);
                  handleModalClose();
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Delete User
              </button>
            </div>
          </div>
        </Modal>
      )}

      <Footer />
    </div>
  );
};

export default UserManagement;
