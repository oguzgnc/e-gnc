// src/components/Navbar.jsx

import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css'; 
import { FaUser, FaShoppingCart, FaBars, FaSearch, FaSignOutAlt } from 'react-icons/fa'; 
// ! GÜNCELLENDİ: Link yerine NavLink import ediyoruz !
import { NavLink, useNavigate } from 'react-router-dom'; 
import { useCart } from '../context/CartContext'; 
import { useAuth } from '../context/AuthContext';
import { products } from '../data/products'; // Ürün verilerini import ediyoruz
import gncsarkuteriLogo from '../assets/gncsarkuteri-logo.png'; // Logonuzu import ediyoruz

function Navbar() {
  const { getCartItemCount } = useCart(); 
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const handleSearchIconClick = () => {
    setShowSearchBar(!showSearchBar);
    setSearchQuery(''); // Arama çubuğu açıldığında veya kapatıldığında sorguyu temizle
    setSearchResults([]); // Sonuçları temizle
  };

  // Arama çubuğu açıldığında input'a otomatik focus
  useEffect(() => {
    if (showSearchBar && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchBar]);

  // Dışarı tıklandığında arama çubuğunu kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target) && 
          !event.target.closest('.nav-icon-link')) {
        setShowSearchBar(false);
      }
    };

    if (showSearchBar) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearchBar]);

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 1) { // 1 karakterden uzun aramalar için filtrele
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  // NavLink'in isActive prop'u sayesinde aktif linki belirleyebiliriz.
  // Bu fonksiyona gerek kalmayabilir, isActive otomatik gelir.
  // const getNavLinkClass = ({ isActive }) => isActive ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">
          <img src={gncsarkuteriLogo} alt="gncsarküteri Logo" className="navbar-logo" />
        </NavLink> {/* Logo için NavLink kullanıyoruz */}
      </div>
      
      <div className="main-nav-links">
        {/* ! GÜNCELLENDİ: Tüm Linkler NavLink oldu ve 'end' prop'u eklendi ! */}
        <NavLink to="/" className="nav-link" end>Ana Sayfa</NavLink> {/* exact prop'u yerine end kullanıyoruz */}
        <NavLink to="/about" className="nav-link">Hakkımda</NavLink>
        <NavLink to="/contact" className="nav-link">İletişim</NavLink>
        <NavLink to="/blog" className="nav-link">Blog</NavLink>
      </div>

      <div className="navbar-links">
        <div className="nav-icon-link" onClick={handleSearchIconClick} style={{ cursor: 'pointer' }}>
            <FaSearch className="nav-icon" />
            <span>Ara</span>
        </div>
        {showSearchBar && (
            <div className="search-bar-container" ref={searchContainerRef}>
                <input 
                    ref={searchInputRef}
                    type="text" 
                    placeholder="Ürün Ara..." 
                    value={searchQuery} 
                    onChange={handleSearchInputChange}
                    className="search-input"
                />
                {searchQuery.length > 1 && searchResults.length > 0 && (
                    <div className="search-results-dropdown">
                        {searchResults.map(product => (
                            <NavLink 
                                to={`/categories/${product.category}?highlight=${product.id}`}
                                key={product.id} 
                                className={() => "search-result-item"}
                                onClick={() => setShowSearchBar(false)}
                            >
                                {product.name}
                            </NavLink>
                        ))}
                    </div>
                )}
                {searchQuery.length > 1 && searchResults.length === 0 && (
                    <div className="search-results-dropdown no-results">Sonuç bulunamadı</div>
                )}
            </div>
        )}
        {/* İkonlu linkler de NavLink olabilir ancak active stilini onlara uygulamayabiliriz */}
        {isLoggedIn ? (
          <button className="nav-icon-link logout-button" onClick={() => {
            logout();
            navigate('/');
          }}>
            <FaSignOutAlt className="nav-icon" />
            <span>Çıkış Yap</span>
          </button>
        ) : (
          <NavLink to="/login" className="nav-icon-link">
            <FaUser className="nav-icon" />
            <span>Üye Ol / Giriş Yap</span>
          </NavLink>
        )}
        <NavLink to="/cart" className="nav-icon-link cart-link">
          <FaShoppingCart className="nav-icon" />
          <span>Sepetim</span>
          {getCartItemCount() > 0 && (
            <span className="cart-item-count">{getCartItemCount()}</span>
          )}
        </NavLink>
        <NavLink to="/menu" className="nav-icon-link menu-icon">
          <FaBars className="nav-icon" />
          <span>Menü</span>
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;