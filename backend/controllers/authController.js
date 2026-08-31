import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../config/database.js';
import { sendVerificationEmail } from '../utils/emailService.js';

// Kullanıcı kaydı
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Email kontrolü
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Bu email adresi zaten kayıtlı'
      });
    }

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // E-posta doğrulama token'ı üret
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Kullanıcıyı veritabanına ekle (is_verified: false, verification_token kaydedilir)
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, is_verified, verification_token) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, name, email, role, is_verified`,
      [name, email, hashedPassword, 'user', false, verificationToken]
    );

    const user = result.rows[0];

    // Doğrulama e-postasını gönder (asenkron - kayıt sürecini bekletmez)
    sendVerificationEmail(user.email, verificationToken).catch(err => {
      console.error('Doğrulama maili gönderim hatası:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Kayıt başarılı, lütfen e-postanızı doğrulayın.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified
      }
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Kayıt sırasında bir hata oluştu'
    });
  }
};

// Kullanıcı girişi
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Kullanıcıyı bul
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email veya şifre hatalı'
      });
    }

    const user = result.rows[0];

    // Şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email veya şifre hatalı'
      });
    }

    // E-posta doğrulama kontrolü (Admin hariç normal kullanıcılar için zorunlu)
    if (user.role !== 'admin' && (user.is_verified === false || user.is_verified === 0)) {
      return res.status(403).json({
        success: false,
        message: 'Lütfen e-postanızı doğrulayın'
      });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Giriş başarılı',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Giriş sırasında bir hata oluştu'
    });
  }
};

// E-posta Doğrulama Metodu
export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Geçersiz veya eksik doğrulama kodu'
    });
  }

  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE verification_token = $1',
      [token]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veya süresi dolmuş doğrulama bağlantısı'
      });
    }

    const user = userResult.rows[0];

    // is_verified durumunu true yap ve token'ı temizle
    await pool.query(
      'UPDATE users SET is_verified = true, verification_token = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    console.log(`✅ [Nodemailer] Kullanıcı (${user.email}) başarıyla doğrulandı.`);

    return res.json({
      success: true,
      message: 'E-posta adresiniz başarıyla doğrulandı! Şimdi giriş yapabilirsiniz.'
    });
  } catch (error) {
    console.error('E-posta doğrulama hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Doğrulama işlemi sırasında bir hata oluştu'
    });
  }
};

// Kullanıcı profili
export const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, is_verified, created_at FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Profil getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Profil bilgileri alınırken hata oluştu'
    });
  }
};
