import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompanyUsers.css';

function CompanyUsers() {
  const navigate = useNavigate();
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Linda Wolf',
      email: 'linda.wolf@rustic-hw.com',
      role: 'Company Administrator',
      unit: 'Headquarters',
      status: 'Active',
      lastLogin: '2026-03-03T10:30:00',
      avatar: 'LW'
    },
    {
      id: 2,
      name: 'Mark Rivers',
      email: 'mark.rivers@rustic-hw.com',
      role: 'Dealer',
      unit: 'Headquarters',
      status: 'Active',
      lastLogin: '2026-03-03T09:15:00',
      avatar: 'MR'
    },
    {
      id: 3,
      name: 'John Smith',
      email: 'john.smith@rustic-hw.com',
      role: 'Purchaser',
      unit: 'Procurement',
      status: 'Active',
      lastLogin: '2026-03-02T16:45:00',
      avatar: 'JS'
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@rustic-hw.com',
      role: 'Approver',
      unit: 'Finance',
      status: 'Active',
      lastLogin: '2026-03-01T14:20:00',
      avatar: 'SJ'
    },
    {
      id: 5,
      name: 'Michael Brown',
      email: 'michael.brown@rustic-hw.com',
      role: 'Purchaser',
      unit: 'Warehouse',
      status: 'Active',
      lastLogin: '2026-02-28T11:30:00',
      avatar: 'MB'
    },
    {
      id: 6,
      name: 'Emily Davis',
      email: 'emily.davis@rustic-hw.com',
      role: 'Viewer',
      unit: 'Sales',
      status: 'Inactive',
      lastLogin: '2026-02-15T09:00:00',
      avatar: 'ED'
    },
    {
      id: 7,
      name: 'Robert Wilson',
      email: 'robert.wilson@rustic-hw.com',
      role: 'Purchaser',
      unit: 'Maintenance',
      status: 'Active',
      lastLogin: '2026-03-02T13:45:00',
      avatar: 'RW'
    },
    {
      id: 8,
      name: 'Jennifer Martinez',
      email: 'jennifer.martinez@rustic-hw.com',
      role: 'Approver',
      unit: 'Operations',
      status: 'Active',
      lastLogin: '2026-03-03T08:30:00',
      avatar: 'JM'
    }
  ]);

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Purchaser',
    unit: 'Headquarters',
    sendEmail: true
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddUser = (e) => {
    e.preventDefault();

    const user = {
      id: users.length + 1,
      name: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
      role: newUser.role,
      unit: newUser.unit,
      status: 'Active',
      lastLogin: null,
      avatar: `${newUser.firstName[0]}${newUser.lastName[0]}`.toUpperCase()
    };

    setUsers([...users, user]);
    setShowAddUser(false);
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      role: 'Purchaser',
      unit: 'Headquarters',
      sendEmail: true
    });
  };

  const handleEditUser = (user) => {
    setEditingUser({...user});
    setShowEditUser(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setShowEditUser(false);
    setEditingUser(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getRoleBadgeClass = (role) => {
    const roleMap = {
      'Company Administrator': 'admin',
      'Dealer': 'dealer',
      'Purchaser': 'purchaser',
      'Approver': 'approver',
      'Viewer': 'viewer'
    };
    return roleMap[role] || 'default';
  };

  return (
    <div className="company-users-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <button className="back-button" onClick={() => navigate('/my-company')}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to My Company
          </button>
          <h1>Users</h1>
          <p className="page-subtitle">Manage user accounts and permissions</p>
        </div>
        <button className="add-user-btn" onClick={() => setShowAddUser(true)}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="users-filters">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="status-filter">
          <button
            className={filterStatus === 'All' ? 'active' : ''}
            onClick={() => setFilterStatus('All')}
          >
            All ({users.length})
          </button>
          <button
            className={filterStatus === 'Active' ? 'active' : ''}
            onClick={() => setFilterStatus('Active')}
          >
            Active ({users.filter(u => u.status === 'Active').length})
          </button>
          <button
            className={filterStatus === 'Inactive' ? 'active' : ''}
            onClick={() => setFilterStatus('Inactive')}
          >
            Inactive ({users.filter(u => u.status === 'Inactive').length})
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="users-list">
        {filteredUsers.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-card-header">
              <div className="user-avatar-large">{user.avatar}</div>
              <div className="user-main-info">
                <h3>{user.name}</h3>
                <p className="user-email">{user.email}</p>
                <div className="user-meta">
                  <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                    {user.role}
                  </span>
                  <span className="unit-badge">{user.unit}</span>
                  <span className={`status-badge ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </div>
              </div>
              <div className="user-actions">
                <button className="icon-btn" title="Edit user" onClick={() => handleEditUser(user)}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.1022 19.4374 1.8789 20 1.8789C20.5626 1.8789 21.1022 2.1022 21.5 2.5C21.8978 2.8978 22.1211 3.43741 22.1211 4C22.1211 4.56259 21.8978 5.1022 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="icon-btn danger" title="Delete user">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="user-card-footer">
              <div className="last-login">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Last login: {formatDate(user.lastLogin)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="no-users">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h3>No users found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="modal-overlay" onClick={() => setShowAddUser(false)}>
          <div className="add-user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New User</h2>
              <button className="close-btn" onClick={() => setShowAddUser(false)}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddUser} className="add-user-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                    required
                    placeholder="Enter first name"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                    required
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                  placeholder="user@rustic-hw.com"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value="Purchaser">Purchaser</option>
                    <option value="Approver">Approver</option>
                    <option value="Dealer">Dealer</option>
                    <option value="Company Administrator">Company Administrator</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Unit *</label>
                  <select
                    value={newUser.unit}
                    onChange={(e) => setNewUser({...newUser, unit: e.target.value})}
                  >
                    <option value="Headquarters">Headquarters</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Finance">Finance</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Sales">Sales</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newUser.sendEmail}
                    onChange={(e) => setNewUser({...newUser, sendEmail: e.target.checked})}
                  />
                  <span>Send welcome email with login instructions</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddUser(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUser && editingUser && (
        <div className="modal-overlay" onClick={() => setShowEditUser(false)}>
          <div className="add-user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit User</h2>
              <button className="close-btn" onClick={() => setShowEditUser(false)}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="add-user-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  disabled
                  style={{ background: '#f3f4f6', cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={editingUser.email}
                  disabled
                  style={{ background: '#f3f4f6', cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  >
                    <option value="Dealer">Dealer</option>
                    <option value="Purchaser">Purchaser</option>
                    <option value="Approver">Approver</option>
                    <option value="Company Administrator">Company Administrator</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Unit *</label>
                  <select
                    value={editingUser.unit}
                    onChange={(e) => setEditingUser({...editingUser, unit: e.target.value})}
                  >
                    <option value="Headquarters">Headquarters</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Finance">Finance</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Sales">Sales</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select
                  value={editingUser.status}
                  onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowEditUser(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyUsers;
