import { useState, useEffect } from 'react';

// Key lưu trong LocalStorage
const CART_KEY = 'xuan_studio_cart';

// Helper lấy giỏ hàng
export const getCart = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Lỗi đọc LocalStorage", e);
    return [];
  }
};

// Helper lưu giỏ hàng và phát tín hiệu cập nhật
const saveCart = (cart) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated')); // Báo cho các component biết
  } catch (e) {
    console.error("Lỗi lưu LocalStorage", e);
  }
};

// Hàm thêm vào giỏ
export const addToCart = (product) => {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    const newCart = cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
    saveCart(newCart);
  } else {
    saveCart([...cart, { ...product, quantity: 1 }]);
  }
};

// Hàm cập nhật số lượng
export const updateQuantity = (productId, delta) => {
  const cart = getCart();
  const newCart = cart.map(item => {
    if (item.id === productId) {
      const newQty = item.quantity + delta;
      return newQty > 0 ? { ...item, quantity: newQty } : item;
    }
    return item;
  });
  saveCart(newCart);
};

// Hàm xóa
export const removeFromCart = (productId) => {
  const cart = getCart();
  const newCart = cart.filter(item => item.id !== productId);
  saveCart(newCart);
};

// Hàm xóa hết (sau khi đặt hàng)
export const clearCart = () => {
  saveCart([]);
};

// Hook React để component tự động cập nhật khi giỏ hàng thay đổi
export const useCartStore = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart()); // Lấy lần đầu

    const handleStorageChange = () => setCart(getCart());
    
    // Lắng nghe sự kiện thay đổi
    window.addEventListener('cart-updated', handleStorageChange);
    return () => window.removeEventListener('cart-updated', handleStorageChange);
  }, []);

  return cart;
};