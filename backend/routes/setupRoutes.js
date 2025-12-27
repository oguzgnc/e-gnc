import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Geçici route - ilk kullanıcıyı admin yap
router.post('/make-first-admin', async (req, res) => {
  try {
    const { email } = req.body;
    
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE email = $2 RETURNING *',
      ['admin', email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.json({ 
      message: 'Kullanıcı admin yapıldı',
      user: { email: result.rows[0].email, role: result.rows[0].role }
    });
  } catch (error) {
    console.error('Admin yapma hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

export default router;
