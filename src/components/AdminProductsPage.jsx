// src/components/AdminProductsPage.jsx
import React from 'react';
import './AdminProductsPage.css';

function AdminProductsPage({ products, onAddProduct, onEditProduct, onDeleteProduct, onToggleStock }) {
  return (
    <div className="admin-products-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">🏷️ Ürün Yönetimi</h1>
          <p className="page-subtitle">Ürünleri görüntüleyin ve yönetin</p>
        </div>
        <button className="btn-add-product" onClick={onAddProduct}>
          <span className="btn-icon">+</span>
          Yeni Ürün Ekle
        </button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ürün ID</th>
              <th>Resim</th>
              <th>Ürün Adı</th>
              <th>Kategori</th>
              <th>Fiyat</th>
              <th>Stok</th>
              <th>Tarih</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map(product => (
                <tr key={product.id}>
                  <td className="td-id">{product.product_id}</td>
                  <td className="td-image">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-thumbnail"
                      />
                    ) : (
                      <div className="no-image">📦</div>
                    )}
                  </td>
                  <td className="td-name">{product.name}</td>
                  <td className="td-category">
                    <span className="category-badge">{product.category}</span>
                  </td>
                  <td className="td-price">₺{Number(product.price).toFixed(2)}</td>
                  <td className="td-stock">
                    <span className={`stock-badge ${product.in_stock ? 'in-stock' : 'out-of-stock'}`}>
                      {product.in_stock ? '✅ Stokta' : '❌ Tükendi'}
                    </span>
                  </td>
                  <td className="td-date">
                    {new Date(product.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="td-actions">
                    <button
                      className="btn-edit"
                      onClick={() => onEditProduct(product)}
                    >
                      ✏️ Düzenle
                    </button>
                    <button
                      className={`btn-stock ${product.in_stock ? 'btn-out' : 'btn-in'}`}
                      onClick={() => onToggleStock(product.id, !product.in_stock)}
                    >
                      {product.in_stock ? '📦 Stoktan Çıkar' : '✅ Stoğa Al'}
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => onDeleteProduct(product.id)}
                    >
                      🗑️ Sil
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-state">
                  Henüz ürün bulunmamaktadır. Yeni ürün eklemek için yukarıdaki butona tıklayın.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProductsPage;
