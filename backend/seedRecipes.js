import pool from './config/database.js';

const seedRecipes = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const recipeResult = await client.query(
      `INSERT INTO recipes (
        title,
        description,
        instructions,
        prep_time,
        image_url
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id`,
      [
        'Kayseri Yağlaması',
        'İncecik hamurlar, kıymalı harç ve yoğurt ile hazırlanan geleneksel Kayseri lezzeti.',
        'Hamuru yoğurup ince bezeler açın. Bezeleri tavada pişirin. Kıymalı harcı soğan ve baharatlarla hazırlayın. Pişen hamurların arasına harç koyarak üst üste dizin. Yoğurt ile servis edin.',
        '60 dakika',
        'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80'
      ]
    );

    const recipeId = recipeResult.rows[0].id;

    const productsResult = await client.query(
      'SELECT id FROM products LIMIT 3'
    );

    if (productsResult.rows.length < 3) {
      throw new Error('Malzeme eklemek için en az 3 ürün bulunmalıdır');
    }

    const ingredients = [
      { quantity: 2, unit: 'adet' },
      { quantity: 500, unit: 'gram' },
      { quantity: 1, unit: 'paket' }
    ];

    for (const [index, product] of productsResult.rows.entries()) {
      await client.query(
        `INSERT INTO recipe_ingredients (
          recipe_id,
          product_id,
          quantity,
          unit
        )
        VALUES ($1, $2, $3, $4)`,
        [
          recipeId,
          product.id,
          ingredients[index].quantity,
          ingredients[index].unit
        ]
      );
    }

    await client.query('COMMIT');
    console.log('Örnek tarif ve malzemeler eklendi');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Örnek tarif eklenirken hata:', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
};

seedRecipes();
