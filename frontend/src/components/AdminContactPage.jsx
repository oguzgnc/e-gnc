// src/components/AdminContactPage.jsx
import React, { useState } from 'react';
import './AdminContactPage.css';

function AdminContactPage({ messages, onMarkAsRead, onDeleteMessage }) {
  const [expandedMessage, setExpandedMessage] = useState(null);

  const toggleMessage = (messageId) => {
    setExpandedMessage(expandedMessage === messageId ? null : messageId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="admin-contact-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">💬 İletişim Mesajları</h1>
          <p className="page-subtitle">
            {messages.length} mesaj • {unreadCount} okunmamış
          </p>
        </div>
      </div>

      <div className="messages-container">
        {messages && messages.length > 0 ? (
          messages.map(message => (
            <div 
              key={message.id} 
              className={`message-card ${!message.is_read ? 'unread' : ''} ${expandedMessage === message.id ? 'expanded' : ''}`}
            >
              <div className="message-header" onClick={() => toggleMessage(message.id)}>
                <div className="message-info">
                  {!message.is_read && <span className="unread-badge">Yeni</span>}
                  <h3 className="message-name">{message.name}</h3>
                  <p className="message-email">📧 {message.email}</p>
                  {message.phone && <p className="message-phone">📱 {message.phone}</p>}
                </div>
                <div className="message-meta">
                  <span className="message-date">{formatDate(message.created_at)}</span>
                  <button className="expand-btn">
                    {expandedMessage === message.id ? '▼' : '▶'}
                  </button>
                </div>
              </div>

              {expandedMessage === message.id && (
                <div className="message-body">
                  {message.subject && (
                    <div className="message-subject">
                      <strong>Konu:</strong> {message.subject}
                    </div>
                  )}
                  <div className="message-content">
                    <strong>Mesaj:</strong>
                    <p>{message.message}</p>
                  </div>
                  <div className="message-actions">
                    {!message.is_read && (
                      <button 
                        className="btn-read"
                        onClick={() => onMarkAsRead(message.id)}
                      >
                        ✓ Okundu İşaretle
                      </button>
                    )}
                    <button 
                      className="btn-delete"
                      onClick={() => onDeleteMessage(message.id)}
                    >
                      🗑️ Sil
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>📭 Henüz mesaj bulunmamaktadır.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminContactPage;
