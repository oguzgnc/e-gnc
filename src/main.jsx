// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ProductDetailPage from './components/ProductDetailPage.jsx';
import AuthPage from './components/AuthPage.jsx';
import CartPage from './components/CartPage.jsx';
import ProductContentSection from './components/ProductContentSection.jsx'; // ProductContentSection'ı burada da import etmeliyiz ki rotası çalışsın
import BlogPage from './components/BlogPage.jsx'; // BlogPage'i import etmeliyiz
import ContactPage from './components/ContactPage.jsx'; // ContactPage'i import etmeliyiz
import CategoryPage from './components/CategoryPage.jsx';
import AboutUsPage from './components/AboutUsPage.jsx'; // AboutUsPage bileşenini import ediyoruz

import { CartProvider } from './context/CartContext.jsx'; 
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css'; // Global CSS dosyanız (boş olmalıydı)

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// ! Tüm uygulama rotaları burada tanımlanır !
const router = createBrowserRouter([
  {
    path: "/", // Ana sayfa yolu
    element: <App />, // Ana sayfa için App bileşenini göster
  },
  {
    path: "/products/:productId", // Ürün detay sayfası yolu. :productId dinamik bir parametredir.
    element: <ProductDetailPage />, // Ürün detay sayfası için ProductDetailPage bileşenini göster
  },
  {
    path: "/login", // Giriş/Kayıt sayfası yolu
    element: <AuthPage />, // Giriş/Kayıt sayfası için AuthPage bileşenini göster
  },
  {
    path: "/cart", // Sepet sayfası yolu
    element: <CartPage />, // Sepet sayfası için CartPage bileşenini göster
  },
  {
    path: "/categories/:categoryId", // Kategori detay sayfası yolu
    element: <CategoryPage />, // ! GÜNCELLENDİ: CategoryPage bileşenini gösteriyoruz !
  },
  {
    path: "/about", // Hakkımda sayfası
    element: <AboutUsPage />,
  },
  {
    path: "/product-content", // Ürün İçeriği sayfası
    element: <ProductContentSection />, // ProductContentSection bileşenini göster
  },
  {
    path: "/contact", // İletişim sayfası
    element: <ContactPage />, // ContactPage bileşenini göster
  },
  {
    path: "/blog", // Blog sayfası
    element: <BlogPage />, // BlogPage bileşenini göster
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Uygulamayı AuthProvider ile sarmalıyoruz ki tüm bileşenler giriş durumuna erişebilsin */}
    <AuthProvider>
      {/* Uygulamanın tamamını CartProvider ile sarmalıyoruz ki tüm bileşenler sepete erişebilsin */}
      <CartProvider>
        {/* Uygulamayı RouterProvider ile sarmalıyoruz ki sayfa yönlendirmeleri çalışsın */}
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
);