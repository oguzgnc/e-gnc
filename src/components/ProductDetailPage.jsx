// src/components/ProductDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetailPage.css'; 
import { useCart } from '../context/CartContext'; 
import { products } from '../data/products'; // ! GÜNCELLENDİ: Merkezi ürün verilerini import ediyoruz !

// ! allProducts sabitini buradan SİLİN !


function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const { addToCart } = useCart(); 

  useEffect(() => {
    // ! GÜNCELLENDİ: products dizisini kullanıyoruz !
    const foundProduct = products.find(p => p.id === productId); 
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedOption(foundProduct.options[0]);
    } else {
      navigate('/');
    }
  }, [productId, navigate]);

  // ... (Geri kalan kod aynı kalacak) ...
}

export default ProductDetailPage;