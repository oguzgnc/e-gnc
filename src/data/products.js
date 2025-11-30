// src/data/products.js

import ezinePeyniriImg from '../assets/ezine-peyniri.jpg';
import sutImg from '../assets/sut.jpg';
import sucukImg from '../assets/sucuk.jpg';
import yogurtImg from '../assets/yogurt.jpg'; 
import salamImg from '../assets/salam.jpg'; 
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
    id: 'organik-gubr',
    name: 'Organik Bitki Gübresi',
    description: 'Tüm bitkileriniz için doğal ve zenginleştirilmiş organik gübre.',
    category: 'tarla-gubr',
    price: 80,
    image: 'https://via.placeholder.com/300x300/a0d9b4/fff?text=Organik+G%C3%BCbre', // Örnek placeholder
    options: [
      { volume: '1 KG', price: 80 },
      { volume: '5 KG', price: 350 },
    ],
  },
  {
    id: 'domates-gubr',
    name: 'Domates Özel Gübre',
    description: 'Domates verimliliğini artıran özel formüllü gübre.',
    category: 'tarla-gubr',
    price: 110,
    image: 'https://via.placeholder.com/300x300/c9e2b1/fff?text=Domates+G%C3%BCbre', // Örnek placeholder
    options: [
      { volume: '1 KG', price: 110 },
      { volume: '3 KG', price: 300 },
    ],
  },
  {
    id: 'pul-biber',
    name: 'Acı Pul Biber',
    description: 'Yemeklerinize acılık ve renk katacak kaliteli pul biber.',
    category: 'baharatlar',
    price: 30,
    image: 'https://via.placeholder.com/300x300/e07c24/fff?text=Pul+Biber', // Örnek placeholder
    options: [
      { volume: '100 Gram', price: 30 },
      { volume: '250 Gram', price: 70 },
    ],
  },
  {
    id: 'kekik',
    name: 'Dağ Kekiği',
    description: 'En doğal ve kokulu dağ kekikleri.',
    category: 'baharatlar',
    price: 25,
    image: 'https://via.placeholder.com/300x300/98c1d9/fff?text=Kekik', // Örnek placeholder
    options: [
      { volume: '50 Gram', price: 25 },
      { volume: '150 Gram', price: 60 },
    ],
  },
];