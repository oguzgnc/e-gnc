import pool from '../config/database.js';

// Tüm mesajları listele (Admin)
export const getAllMessages = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      messages: result.rows
    });
  } catch (error) {
    console.error('Mesajları listeleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Mesajlar listelenirken hata oluştu'
    });
  }
};

// Yeni mesaj oluştur
export const createMessage = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'İsim, email ve mesaj alanları zorunludur'
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, phone, subject, message) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [name, email, phone || '', subject || '', message]
    );

    res.status(201).json({
      success: true,
      message: 'Mesajınız başarıyla gönderildi',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Mesaj oluşturma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Mesaj gönderilirken hata oluştu'
    });
  }
};

// Mesajı okundu olarak işaretle
export const markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE contact_messages 
       SET is_read = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mesaj bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Mesaj okundu olarak işaretlendi',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Mesaj güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Mesaj güncellenirken hata oluştu'
    });
  }
};

// Mesajı sil
export const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM contact_messages WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mesaj bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Mesaj başarıyla silindi'
    });
  } catch (error) {
    console.error('Mesaj silme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Mesaj silinirken hata oluştu'
    });
  }
};
