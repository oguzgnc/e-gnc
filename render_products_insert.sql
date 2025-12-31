-- Render.com PostgreSQL için Ürün Ekleme Script'i
-- Bu script'i Render Dashboard > PostgreSQL > Shell'de çalıştırın

-- Önce mevcut ürünleri temizle (opsiyonel)
-- DELETE FROM products;

-- 1. Tam Yağlı Süt
INSERT INTO products (product_id, name, description, category, price, image, options, in_stock) 
VALUES (
  'sut',
  'Tam Yağlı Süt',
  'Taptaze çiftlik sütü, doğal ve besleyici.',
  'sut-urunleri',
  35.00,
  '/src/assets/sut.jpg',
  '[{"price": 35, "volume": "1 Litre"}, {"price": 100, "volume": "3 Litre"}, {"price": 150, "volume": "5 Litre"}]'::jsonb,
  true
) ON CONFLICT (product_id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  image = EXCLUDED.image,
  options = EXCLUDED.options,
  in_stock = EXCLUDED.in_stock;

-- 2. Ev Yapımı Yoğurt
INSERT INTO products (product_id, name, description, category, price, image, options, in_stock) 
VALUES (
  'yogurt',
  'Ev Yapımı Yoğurt',
  'Doğal mayayla hazırlanan geleneksel ev yoğurdu.',
  'sut-urunleri',
  50.00,
  '/src/assets/yogurt.jpg',
  '[{"price": 50, "volume": "750 Gram"}, {"price": 90, "volume": "1.5 KG"}]'::jsonb,
  true
) ON CONFLICT (product_id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  image = EXCLUDED.image,
  options = EXCLUDED.options,
  in_stock = EXCLUDED.in_stock;

-- 3. Ezine Peyniri
INSERT INTO products (product_id, name, description, category, price, image, options, in_stock) 
VALUES (
  'ezine-peyniri',
  'Ezine Peyniri',
  'Gerçek Ezine peyniri lezzeti, kahvaltı sofralarının vazgeçilmezi.',
  'sut-urunleri',
  180.00,
  '/src/assets/ezine-peyniri.jpg',
  '[{"price": 90, "volume": "250 Gram"}, {"price": 180, "volume": "500 Gram"}, {"price": 350, "volume": "1 KG"}]'::jsonb,
  true
) ON CONFLICT (product_id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  image = EXCLUDED.image,
  options = EXCLUDED.options,
  in_stock = EXCLUDED.in_stock;

-- 4. Ev Yapımı Sucuk
INSERT INTO products (product_id, name, description, category, price, image, options, in_stock) 
VALUES (
  'sucuk',
  'Ev Yapımı Sucuk',
  'Geleneksel yöntemlerle hazırlanan, baharatlı ve lezzetli sucuk.',
  'et-urunleri',
  120.00,
  '/src/assets/sucuk.jpg',
  '[{"price": 120, "volume": "250 Gram"}, {"price": 220, "volume": "500 Gram"}, {"price": 400, "volume": "1 KG"}]'::jsonb,
  true
) ON CONFLICT (product_id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  image = EXCLUDED.image,
  options = EXCLUDED.options,
  in_stock = EXCLUDED.in_stock;

-- 5. Macar Salam
INSERT INTO products (product_id, name, description, category, price, image, options, in_stock) 
VALUES (
  'salam',
  'Macar Salam',
  'Özel baharatlarla harmanlanmış, enfes Macar salamı.',
  'et-urunleri',
  95.00,
  '/src/assets/salam.jpg',
  '[{"price": 95, "volume": "200 Gram"}, {"price": 180, "volume": "400 Gram"}]'::jsonb,
  true
) ON CONFLICT (product_id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  image = EXCLUDED.image,
  options = EXCLUDED.options,
  in_stock = EXCLUDED.in_stock;

-- 6. Agrosol Granulous 17
INSERT INTO products (product_id, name, description, category, price, image, options, in_stock) 
VALUES (
  'agrosol-granulous-17',
  'Agrosol Granulous 17',
  'Granit edilmiş içerik - Çim Çeşitleri Magnezyum Oksit (MgO), Suda Çözünür Kükürt Trioksit (SO3)',
  'tarla-gubreleri',
  80.00,
  '/src/assets/agrosol-max-33-17.png',
  '[{"price": 80, "volume": "25 KG"}, {"price": 150, "volume": "50 KG"}]'::jsonb,
  true
) ON CONFLICT (product_id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  image = EXCLUDED.image,
  options = EXCLUDED.options,
  in_stock = EXCLUDED.in_stock;

-- 7. Agrosol Magnezyum Sülfat
INSERT INTO products (product_id, name, description, category, price, image, options, in_stock) 
VALUES (
  'agrosol-magnesium-sulfat',
  'Agrosol Magnezyum Sülfat',
  'Magnezyum Sülfat - Granit Edilen Form, Suda Çözünür Magnezyum Oksit (MgO), Suda Çözünür Kükürt Trioksit (SO3)',
  'tarla-gubreleri',
  110.00,
  '/src/assets/agrosol-max-magnezyumsülfat.png',
  '[{"price": 110, "volume": "25 KG"}, {"price": 200, "volume": "50 KG"}]'::jsonb,
  true
) ON CONFLICT (product_id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  image = EXCLUDED.image,
  options = EXCLUDED.options,
  in_stock = EXCLUDED.in_stock;

-- 8. Agrosol Max Mix Granülöz
INSERT INTO products (product_id, name, description, category, price, image, options, in_stock) 
VALUES (
  'agrosol-max-mix',
  'Agrosol Max Mix Granülöz Çinko Katkılı',
  'Granit Edilmiş İçerik - Suda Çözünür Magnezyum Oksit (MgO), Suda Çözünür Kükürt Trioksit (SO3), Suda Çözünür Çinko (Zn)',
  'tarla-gubreleri',
  130.00,
  '/src/assets/agrosol-max-mix.png',
  '[{"price": 130, "volume": "25 KG"}, {"price": 240, "volume": "50 KG"}]'::jsonb,
  true
) ON CONFLICT (product_id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  image = EXCLUDED.image,
  options = EXCLUDED.options,
  in_stock = EXCLUDED.in_stock;

-- 9. Dağ Kekiği
INSERT INTO products (product_id, name, description, category, price, image, options, in_stock) 
VALUES (
  'kekik',
  'Dağ Kekiği',
  'En doğal ve kokulu dağ kekikleri.',
  'baharatlar',
  25.00,
  '/src/assets/dağ-kekiği.jpg',
  '[{"price": 25, "volume": "50 Gram"}, {"price": 60, "volume": "150 Gram"}]'::jsonb,
  true
) ON CONFLICT (product_id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  image = EXCLUDED.image,
  options = EXCLUDED.options,
  in_stock = EXCLUDED.in_stock;

-- Sonuç kontrolü
SELECT COUNT(*) as toplam_urun FROM products;
SELECT product_id, name, category, price, in_stock FROM products ORDER BY id;
