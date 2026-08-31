import pool from './config/database.js';

const fixUsers = async () => {
  try {
    const result = await pool.query(
      'UPDATE users SET is_verified = true WHERE is_verified IS NULL OR is_verified = false'
    );
    console.log(`✅ ${result.rowCount} adet mevcut kullanıcının e-posta doğrulama durumu "onaylandı" (is_verified = true) olarak güncellendi.`);
  } catch (error) {
    console.error('❌ Kullanıcılar güncellenirken hata oluştu:', error.message);
  } finally {
    await pool.end();
  }
};

fixUsers();
