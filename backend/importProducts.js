import pool from './config/database.js';

const products = [
  // SÜT ÜRÜNLERİ
  {
    product_id: 'sut',
    name: 'Tam Yağlı Süt',
    description: 'Taptaze çiftlik sütü, doğal ve besleyici.',
    category: 'sut-urunleri',
    price: 35.00,
    image: '/src/assets/sut.jpg',
    options: JSON.stringify([
      { volume: '1 Litre', price: 35 },
      { volume: '3 Litre', price: 100 },
      { volume: '5 Litre', price: 150 }
    ])
  },
  {
    product_id: 'yogurt',
    name: 'Ev Yapımı Yoğurt',
    description: 'Doğal mayayla hazırlanan geleneksel ev yoğurdu.',
    category: 'sut-urunleri',
    price: 50.00,
    image: '/src/assets/yogurt.jpg',
    options: JSON.stringify([
      { volume: '750 Gram', price: 50 },
      { volume: '1.5 KG', price: 90 }
    ])
  },
  {
    product_id: 'ezine-peyniri',
    name: 'Ezine Peyniri',
    description: 'Gerçek Ezine peyniri lezzeti, kahvaltı sofralarının vazgeçilmezi.',
    category: 'sut-urunleri',
    price: 180.00,
    image: '/src/assets/ezine-peyniri.jpg',
    options: JSON.stringify([
      { volume: '250 Gram', price: 90 },
      { volume: '500 Gram', price: 180 },
      { volume: '1 KG', price: 350 }
    ])
  },
  // ET ÜRÜNLERİ
  {
    product_id: 'sucuk',
    name: 'Ev Yapımı Sucuk',
    description: 'Geleneksel yöntemlerle hazırlanan, baharatlı ve lezzetli sucuk.',
    category: 'et-urunleri',
    price: 120.00,
    image: '/src/assets/sucuk.jpg',
    options: JSON.stringify([
      { volume: '250 Gram', price: 120 },
      { volume: '500 Gram', price: 220 },
      { volume: '1 KG', price: 400 }
    ])
  },
  {
    product_id: 'salam',
    name: 'Macar Salam',
    description: 'Özel baharatlarla harmanlanmış, enfes Macar salamı.',
    category: 'et-urunleri',
    price: 95.00,
    image: '/src/assets/salam.jpg',
    options: JSON.stringify([
      { volume: '200 Gram', price: 95 },
      { volume: '400 Gram', price: 180 }
    ])
  },
  // TARLA GÜBRELERİ
  {
    product_id: 'agrosol-granulous-17',
    name: 'Agrosol Granulous 17',
    description: 'Granit edilmiş içerik - Çim Çeşitleri Magnezyum Oksit (MgO), Suda Çözünür Kükürt Trioksit (SO3)',
    category: 'tarla-gubreleri',
    price: 80.00,
    image: '/src/assets/agrosol-max-33-17.png',
    options: JSON.stringify([
      { volume: '25 KG', price: 80 },
      { volume: '50 KG', price: 150 }
    ])
  },
  {
    product_id: 'agrosol-magnesium-sulfat',
    name: 'Agrosol Magnezyum Sülfat',
    description: 'Magnezyum Sülfat - Granit Edilen Form, Suda Çözünür Magnezyum Oksit (MgO), Suda Çözünür Kükürt Trioksit (SO3)',
    category: 'tarla-gubreleri',
    price: 110.00,
    image: '/src/assets/agrosol-max-magnezyumsülfat.png',
    options: JSON.stringify([
      { volume: '25 KG', price: 110 },
      { volume: '50 KG', price: 200 }
    ])
  },
  {
    product_id: 'agrosol-max-mix',
    name: 'Agrosol Max Mix Granülöz Çinko Katkılı',
    description: 'Granit Edilmiş İçerik - Suda Çözünür Magnezyum Oksit (MgO), Suda Çözünür Kükürt Trioksit (SO3), Suda Çözünür Çinko (Zn)',
    category: 'tarla-gubreleri',
    price: 130.00,
    image: '/src/assets/agrosol-max-mix.png',
    options: JSON.stringify([
      { volume: '25 KG', price: 130 },
      { volume: '50 KG', price: 240 }
    ])
  },
  // BAHARATLAR
  {
    product_id: 'kekik',
    name: 'Dağ Kekiği',
    description: 'En doğal ve kokulu dağ kekikleri.',
    category: 'baharatlar',
    price: 25.00,
    image: '/src/assets/dağ-kekiği.jpg',
    options: JSON.stringify([
      { volume: '50 Gram', price: 25 },
      { volume: '150 Gram', price: 60 }
    ])
  }
];

async function importProducts() {
  try {
    console.log('🔄 Ürünler veritabanına aktarılıyor...');

    for (const product of products) {
      // Ürün zaten varsa güncelle, yoksa ekle
      const existingProduct = await pool.query(
        'SELECT id FROM products WHERE product_id = $1',
        [product.product_id]
      );

      if (existingProduct.rows.length > 0) {
        await pool.query(
          `UPDATE products 
           SET name = $1, description = $2, category = $3, price = $4, image = $5, options = $6, updated_at = CURRENT_TIMESTAMP
           WHERE product_id = $7`,
          [product.name, product.description, product.category, product.price, product.image, product.options, product.product_id]
        );
        console.log(`✅ Güncellendi: ${product.name}`);
      } else {
        await pool.query(
          `INSERT INTO products (product_id, name, description, category, price, image, options)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [product.product_id, product.name, product.description, product.category, product.price, product.image, product.options]
        );
        console.log(`✅ Eklendi: ${product.name}`);
      }
    }

    console.log('✅ Tüm ürünler başarıyla aktarıldı!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

importProducts();
