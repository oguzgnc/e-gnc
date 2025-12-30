import pool from '../config/database.js';

// Yeni sipariş oluştur
export const createOrder = async (req, res) => {
  const { cartItems, totalPrice, shippingAddress, customerEmail, customerName } = req.body;
  
  // Token varsa kullanıcı ID'sini al, yoksa null
  const userId = req.user ? req.user.userId : null;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Sepetiniz boş'
    });
  }

  if (!customerEmail || !customerName) {
    return res.status(400).json({
      success: false,
      message: 'Müşteri bilgileri eksik'
    });
  }

  try {
    // Transaction başlat
    await pool.query('BEGIN');

    // Siparişi oluştur (user_id opsiyonel)
    const orderResult = await pool.query(
      `INSERT INTO orders (user_id, total_price, status, shipping_address, customer_email, customer_name) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, user_id, total_price, status, shipping_address, customer_email, customer_name, created_at`,
      [userId, totalPrice, 'pending', shippingAddress, customerEmail, customerName]
    );

    const order = orderResult.rows[0];

    // Sipariş detaylarını ekle
    for (const item of cartItems) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price, volume) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          order.id,
          item.product.id,
          item.product.name,
          item.quantity,
          item.selectedOption.price,
          item.selectedOption.volume
        ]
      );
    }

    // Transaction'ı tamamla
    await pool.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Sipariş başarıyla oluşturuldu',
      order
    });
  } catch (error) {
    // Hata durumunda rollback
    await pool.query('ROLLBACK');
    console.error('Sipariş oluşturma hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sipariş oluşturulurken hata oluştu'
    });
  }
};

// Kullanıcının siparişlerini getir
export const getUserOrders = async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT 
        o.id, 
        o.total_price, 
        o.status, 
        o.shipping_address,
        o.created_at,
        json_agg(
          json_build_object(
            'product_name', oi.product_name,
            'quantity', oi.quantity,
            'price', oi.price,
            'volume', oi.volume
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      orders: result.rows
    });
  } catch (error) {
    console.error('Siparişleri getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Siparişler alınırken hata oluştu'
    });
  }
};

// Sipariş detayını getir
export const getOrderDetails = async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.userId;

  try {
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sipariş bulunamadı'
      });
    }

    const itemsResult = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1',
      [orderId]
    );

    res.json({
      success: true,
      order: {
        ...orderResult.rows[0],
        items: itemsResult.rows
      }
    });
  } catch (error) {
    console.error('Sipariş detay hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Sipariş detayı alınırken hata oluştu'
    });
  }
};
