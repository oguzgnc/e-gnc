// src/components/AdminUsersPage.jsx
import React, { useState } from 'react';
import './AdminUsersPage.css';

function AdminUsersPage({ users, onRoleChange, onDeleteUser }) {
  return (
    <div className="admin-users-page">
      <div className="page-header">
        <h1 className="page-title">👥 Kullanıcı Yönetimi</h1>
        <p className="page-subtitle">Kullanıcıları görüntüleyin ve yönetin</p>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>İsim</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Kayıt Tarihi</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map(user => (
                <tr key={user.id}>
                  <td className="td-id">{user.id}</td>
                  <td className="td-name">{user.name}</td>
                  <td className="td-email">{user.email}</td>
                  <td className="td-role">
                    <select
                      className="role-select"
                      value={user.role}
                      onChange={(e) => onRoleChange(user.id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="td-date">
                    {new Date(user.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="td-actions">
                    <button
                      className="btn-delete"
                      onClick={() => onDeleteUser(user.id)}
                    >
                      🗑️ Sil
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-state">
                  Henüz kullanıcı bulunmamaktadır.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsersPage;
