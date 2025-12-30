import jwt from 'jsonwebtoken';

// Verify JWT token (opsiyonel - token yoksa devam eder)
export const verifyTokenOptional = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { userId, email, role }
    } catch (error) {
      // Token geçersiz ama devam et
      req.user = null;
    }
  } else {
    req.user = null;
  }
  
  next();
};

// Verify JWT token (zorunlu)
export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token bulunamadı. Lütfen giriş yapın.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, email, role }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Geçersiz token. Lütfen tekrar giriş yapın.'
    });
  }
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Bu işlem için yetkiniz yok. Sadece admin kullanıcılar erişebilir.'
    });
  }
  next();
};
