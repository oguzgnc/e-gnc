// src/data/products.js

import ezinePeyniriImg from '../assets/ezine-peyniri.jpg';
import sutImg from '../assets/sut.jpg';
import sucukImg from '../assets/sucuk.jpg';
import yogurtImg from '../assets/yogurt.jpg'; 
import salamImg from '../assets/salam.jpg';
import agrosolGranulous17Img from '../assets/agrosol-max-33-17.png';
import agrosolMagnesiumSulfatImg from '../assets/agrosol-max-magnezyumsülfat.png';
import agrosolMaxMixImg from '../assets/agrosol-max-mix.png';
import dagKekigiImg from '../assets/dağ-kekiği.jpg';
// Eğer kullandıysanız, diğer görselleri de import edin
// import keciPeyniriImg from '../assets/keci-peyniri.jpg'; 
// import kefirImg from '../assets/kefir.jpg'; 

export const products = [
  {
    id: 'sut',
    name: 'Tam Yağlı Süt',
    description: 'Taptaze çiftlik sütü, doğal ve besleyici.',
    category: 'sut-urunleri', // ! YENİ: Kategori bilgisi !
    price: 35,
    image: sutImg,
    options: [
      { volume: '1 Litre', price: 35 },
      { volume: '3 Litre', price: 100 },
      { volume: '5 Litre', price: 150 },
    ],
  },
  {
    id: 'yogurt',
    name: 'Ev Yapımı Yoğurt',
    description: 'Doğal mayayla hazırlanan geleneksel ev yoğurdu.',
    category: 'sut-urunleri', // ! YENİ: Kategori bilgisi !
    price: 50,
    image: yogurtImg,
    options: [
      { volume: '750 Gram', price: 50 },
      { volume: '1.5 KG', price: 90 },
    ],
  },
  {
    id: 'ezine-peyniri', // ID'yi daha açıklayıcı hale getirdim
    name: 'Ezine Peyniri',
    description: 'Gerçek Ezine peyniri lezzeti, kahvaltı sofralarının vazgeçilmezi.',
    category: 'sut-urunleri', // ! YENİ: Kategori bilgisi !
    price: 180,
    image: ezinePeyniriImg,
    options: [
      { volume: '250 Gram', price: 90 },
      { volume: '500 Gram', price: 180 },
      { volume: '1 KG', price: 350 },
    ],
  },
  {
    id: 'sucuk',
    name: 'Ev Yapımı Sucuk',
    description: 'Geleneksel yöntemlerle hazırlanan, baharatlı ve lezzetli sucuk.',
    category: 'et-urunleri', // ! YENİ: Kategori bilgisi !
    price: 120,
    image: sucukImg,
    options: [
      { volume: '250 Gram', price: 120 },
      { volume: '500 Gram', price: 220 },
      { volume: '1 KG', price: 400 },
    ],
  },
  {
    id: 'salam',
    name: 'Macar Salam',
    description: 'Özel baharatlarla harmanlanmış, enfes Macar salamı.',
    category: 'et-urunleri', // ! YENİ: Kategori bilgisi !
    price: 95,
    image: salamImg,
    options: [
      { volume: '200 Gram', price: 95 },
      { volume: '400 Gram', price: 180 },
    ],
  },
  // ! YENİ: Tarla Gübreleri ve Baharatlar için örnek ürünler ekliyoruz !
  {
    id: 'agrosol-granulous-17',
    name: 'Agrosol Granulous 17',
    description: 'Granit edilmiş içerik - Çim Çeşitleri Magnezyum Oksit (MgO), Suda Çözünür Kükürt Trioksit (SO3)',
    category: 'tarla-gubr',
    price: 80,
    image: agrosolGranulous17Img,
    options: [
      { volume: '25 KG', price: 80 },
      { volume: '50 KG', price: 150 },
    ],
  },
  {
    id: 'agrosol-magnesium-sulfat',
    name: 'Agrosol Magnezyum Sülfat',
    description: 'Magnezyum Sülfat - Granit Edilen Form, Suda Çözünür Magnezyum Oksit (MgO), Suda Çözünür Kükürt Trioksit (SO3)',
    category: 'tarla-gubr',
    price: 110,
    image: agrosolMagnesiumSulfatImg,
    options: [
      { volume: '25 KG', price: 110 },
      { volume: '50 KG', price: 200 },
    ],
  },
  {
    id: 'agrosol-max-mix',
    name: 'Agrosol Max Mix Granülöz Çinko Katkılı',
    description: 'Granit Edilmiş İçerik - Suda Çözünür Magnezyum Oksit (MgO), Suda Çözünür Kükürt Trioksit (SO3), Suda Çözünür Çinko (Zn)',
    category: 'tarla-gubr',
    price: 130,
    image: agrosolMaxMixImg,
    options: [
      { volume: '25 KG', price: 130 },
      { volume: '50 KG', price: 240 },
    ],
  },
  {
    id: 'kekik',
    name: 'Dağ Kekiği',
    description: 'En doğal ve kokulu dağ kekikleri.',
    category: 'baharatlar',
    price: 25,
    image: dagKekigiImg,
    options: [
      { volume: '50 Gram', price: 25 },
      { volume: '150 Gram', price: 60 },
    ],
  },
];