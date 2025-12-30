import pool from '../config/database.js';

// Tüm kullanıcıları listele
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      users: result.rows
    });
  } catch (error) {
    console.error('Kullanıcıları listeleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcılar listelenirken hata oluştu'
    });
  }
};

// Kullanıcı rolünü güncelle
export const updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Geçersiz rol. Sadece "user" veya "admin" olabilir'
    });
  }

  try {
    const result = await pool.query(
      'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, email, role',
      [role, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Kullanıcı rolü güncellendi',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Rol güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Rol güncellenirken hata oluştu'
    });
  }
};

// Kullanıcı sil
export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Kullanıcı başarıyla silindi'
    });
  } catch (error) {
    console.error('Kullanıcı silme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı silinirken hata oluştu'
    });
  }
};

// Tüm siparişleri listele
export const getAllOrders = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.id, 
        o.user_id, 
        COALESCE(u.name, o.customer_name, 'Misafir') as user_name,
        COALESCE(u.email, o.customer_email, 'Belirtilmemiş') as user_email,
        o.total_price, 
        o.status, 
        o.shipping_address,
        o.created_at,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_name', oi.product_name,
            'quantity', oi.quantity,
            'price', oi.price,
            'volume', oi.volume
          )
        ) as items
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id, u.name, u.email, o.customer_name, o.customer_email
      ORDER BY o.created_at DESC
    `);

    res.json({
      success: true,
      orders: result.rows
    });
  } catch (error) {
    console.error('Siparişleri listeleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Siparişler listelenirken hata oluştu'
    });
  }
};

// Sipariş durumunu güncelle
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Geçersiz sipariş durumu'
    });
  }

  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Sipariş durumu güncellendi',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Sipariş güncelleme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sipariş güncellenirken hata oluştu'
    });
  }
};

// Dashboard istatistikleri
export const getDashboardStats = async (req, res) => {
  try {
    // Toplam kullanıcı sayısı
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    
    // Toplam sipariş sayısı
    const ordersCount = await pool.query('SELECT COUNT(*) FROM orders');
    
    // Toplam gelir
    const totalRevenue = await pool.query('SELECT SUM(total_price) FROM orders WHERE status != $1', ['cancelled']);
    
    // Bekleyen siparişler
    const pendingOrders = await pool.query('SELECT COUNT(*) FROM orders WHERE status = $1', ['pending']);
    
    // Sipariş durumlarına göre sayılar
    const ordersByStatus = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM orders
      GROUP BY status
    `);
    
    // Kategorilere göre satış sayıları (order_items'dan)
    const categorySales = await pool.query(`
      SELECT 
        LOWER(SPLIT_PART(product_name, ' ', 1)) as category,
        SUM(quantity) as total_quantity
      FROM order_items
      GROUP BY LOWER(SPLIT_PART(product_name, ' ', 1))
    `);

    // Sipariş durumlarını objeye çevir
    const statusCounts = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };
    
    ordersByStatus.rows.forEach(row => {
      statusCounts[row.status] = parseInt(row.count);
    });

    // Kategori satışlarını objeye çevir
    const categorySalesObj = {};
    categorySales.rows.forEach(row => {
      categorySalesObj[row.category] = parseInt(row.total_quantity);
    });

    res.json({
      success: true,
      stats: {
        totalUsers: parseInt(usersCount.rows[0].count),
        totalOrders: parseInt(ordersCount.rows[0].count),
        totalRevenue: parseFloat(totalRevenue.rows[0].sum || 0),
        pendingOrders: parseInt(pendingOrders.rows[0].count),
        ordersByStatus: statusCounts,
        categorySales: categorySalesObj
      }
    });
  } catch (error) {
    console.error('Dashboard istatistikleri hatası:', error);
    res.status(500).json({
      success: false,
      message: 'İstatistikler alınırken hata oluştu'
    });
  }
};
