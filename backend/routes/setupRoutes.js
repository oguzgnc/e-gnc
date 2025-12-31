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

// Ürünleri database'e ekle (tek seferlik setup)
router.post('/seed-products', async (req, res) => {
  try {
    const products = [
      {
        product_id: 'sut',
        name: 'Tam Yağlı Süt',
        description: 'Taptaze çiftlik sütü, doğal ve besleyici.',
        category: 'sut-urunleri',
        price: 35.00,
        image: '/src/assets/sut.jpg',
        options: [{"price": 35, "volume": "1 Litre"}, {"price": 100, "volume": "3 Litre"}, {"price": 150, "volume": "5 Litre"}]
      },
      {
        product_id: 'yogurt',
        name: 'Ev Yapımı Yoğurt',
        description: 'Doğal mayayla hazırlanan geleneksel ev yoğurdu.',
        category: 'sut-urunleri',
        price: 50.00,
        image: '/src/assets/yogurt.jpg',
        options: [{"price": 50, "volume": "750 Gram"}, {"price": 90, "volume": "1.5 KG"}]
      },
      {
        product_id: 'ezine-peyniri',
        name: 'Ezine Peyniri',
        description: 'Gerçek Ezine peyniri lezzeti, kahvaltı sofralarının vazgeçilmezi.',
        category: 'sut-urunleri',
        price: 180.00,
        image: '/src/assets/ezine-peyniri.jpg',
        options: [{"price": 90, "volume": "250 Gram"}, {"price": 180, "volume": "500 Gram"}, {"price": 350, "volume": "1 KG"}]
      },
      {
        product_id: 'sucuk',
        name: 'Ev Yapımı Sucuk',
        description: 'Geleneksel yöntemlerle hazırlanan, baharatlı ve lezzetli sucuk.',
        category: 'et-urunleri',
        price: 120.00,
        image: '/src/assets/sucuk.jpg',
        options: [{"price": 120, "volume": "250 Gram"}, {"price": 220, "volume": "500 Gram"}, {"price": 400, "volume": "1 KG"}]
      },
      {
        product_id: 'salam',
        name: 'Macar Salam',
        description: 'Özel baharatlarla harmanlanmış, enfes Macar salamı.',
        category: 'et-urunleri',
        price: 95.00,
        image: '/src/assets/salam.jpg',
        options: [{"price": 95, "volume": "200 Gram"}, {"price": 180, "volume": "400 Gram"}]
      },
      {
        product_id: 'agrosol-granulous-17',
        name: 'Agrosol Granulous 17',
        description: 'Granit edilmiş içerik - Çim Çeşitleri Magnezyum Oksit (MgO), Suda Çözünür Kükürt Trioksit (SO3)',
        category: 'tarla-gubreleri',
        price: 80.00,
        image: '/src/assets/agrosol-max-33-17.png',
        options: [{"price": 80, "volume": "25 KG"}, {"price": 150, "volume": "50 KG"}]
      },
      {
        product_id: 'agrosol-magnesium-sulfat',
        name: 'Agrosol Magnezyum Sülfat',
        description: 'Magnezyum Sülfat - Granit Edilen Form, Suda Çözünür Magnezyum Oksit (MgO), Suda Çözünür Kükürt Trioksit (SO3)',
        category: 'tarla-gubreleri',
        price: 110.00,
        image: '/src/assets/agrosol-max-magnezyumsülfat.png',
        options: [{"price": 110, "volume": "25 KG"}, {"price": 200, "volume": "50 KG"}]
      },
      {
        product_id: 'agrosol-max-mix',
        name: 'Agrosol Max Mix Granülöz Çinko Katkılı',
        description: 'Granit Edilmiş İçerik - Suda Çözünür Magnezyum Oksit (MgO), Suda Çözünür Kükürt Trioksit (SO3), Suda Çözünür Çinko (Zn)',
        category: 'tarla-gubreleri',
        price: 130.00,
        image: '/src/assets/agrosol-max-mix.png',
        options: [{"price": 130, "volume": "25 KG"}, {"price": 240, "volume": "50 KG"}]
      },
      {
        product_id: 'kekik',
        name: 'Dağ Kekiği',
        description: 'En doğal ve kokulu dağ kekikleri.',
        category: 'baharatlar',
        price: 25.00,
        image: '/src/assets/dağ-kekiği.jpg',
        options: [{"price": 25, "volume": "50 Gram"}, {"price": 60, "volume": "150 Gram"}]
      }
    ];

    let addedCount = 0;
    let skippedCount = 0;

    for (const product of products) {
      try {
        const result = await pool.query(
          `INSERT INTO products (product_id, name, description, category, price, image, options, in_stock) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (product_id) DO NOTHING
           RETURNING product_id`,
          [
            product.product_id,
            product.name,
            product.description,
            product.category,
            product.price,
            product.image,
            JSON.stringify(product.options),
            true
          ]
        );
        if (result.rows.length > 0) {
          addedCount++;
        } else {
          skippedCount++;
        }
      } catch (err) {
        console.error(`Ürün eklenemedi: ${product.name}`, err);
        skippedCount++;
      }
    }

    const countResult = await pool.query('SELECT COUNT(*) FROM products');
    
    res.json({ 
      message: 'Ürünler eklendi',
      added: addedCount,
      skipped: skippedCount,
      total: parseInt(countResult.rows[0].count)
    });
  } catch (error) {
    console.error('Ürün ekleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
});

export default router;
