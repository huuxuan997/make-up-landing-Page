import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowLeft, Camera, Menu, Plus, Minus, Trash2, X as CloseIcon, Share2, Check, Sparkles } from 'lucide-react';

// Full product data
const products = [
  { id: 1, name: "Mi Giả Tự Nhiên", price: 59000, category: "Phụ Kiện", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3", description: "Mi giả sợi tơ mềm mại, tự nhiên." },
  { id: 2, name: "Keo Xịt Tóc Butterfly", price: 120000, category: "Tóc & Makeup", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3", description: "Giữ nếp tóc suốt 24h, không gây khô." },
  { id: 3, name: "Lens Mắt Hổ Phách", price: 150000, category: "Lens", image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3", description: "Lens màu tự nhiên, giãn tròng nhẹ." },
  { id: 4, name: "Trâm Cài Tóc Cổ Trang", price: 250000, category: "Phụ Kiện", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3", description: "Mạ vàng đính ngọc trai, thiết kế cổ điển." },
  { id: 5, name: "Son Kem Lì Vintage", price: 89000, category: "Tóc & Makeup", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3", description: "Son kem lì bền màu, tone đỏ vintage." },
  { id: 6, name: "Phấn Má Hồng Đào", price: 95000, category: "Tóc & Makeup", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3", description: "Phấn má tự nhiên, màu hồng đào ngọt ngào." },
  { id: 7, name: "Băng Đô Hoa Nhí", price: 65000, category: "Phụ Kiện", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3", description: "Băng đô hoa nhí vintage, phong cách retro." },
  { id: 8, name: "Nước Hoa Hồng Tự Nhiên", price: 120000, category: "Skincare", image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3", description: "Nước hoa hồng tự nhiên, dưỡng ẩm da." }
];

// Simple cart functions với localStorage
const getCart = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('xuan_studio_cart');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

const saveCart = (cart) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('xuan_studio_cart', JSON.stringify(cart));
  } catch (e) {
    console.error("Lỗi lưu cart", e);
  }
};

const TetShopSimple = () => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  console.log('TetShopSimple rendered');

  // Load cart từ localStorage khi component mount
  useEffect(() => {
    setCart(getCart());
  }, []);

  // Cart functions
  const addToCart = (product) => {
    console.log('Adding to cart:', product.name);
    const currentCart = getCart();
    const existing = currentCart.find(item => item.id === product.id);
    
    if (existing) {
      const newCart = currentCart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCart(newCart);
      setCart(newCart);
    } else {
      const newCart = [...currentCart, { ...product, quantity: 1 }];
      saveCart(newCart);
      setCart(newCart);
    }
    setIsCartOpen(true);
  };

  const updateQuantity = (productId, delta) => {
    const newCart = cart.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0);
    
    saveCart(newCart);
    setCart(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    saveCart(newCart);
    setCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
    setCart([]);
  };

  // Navigation functions
  const goHome = () => {
    console.log('Going home');
    window.location.href = '/';
  };

  const toggleCart = () => {
    console.log('Toggling cart');
    setIsCartOpen(!isCartOpen);
  };

  // Product modal functions
  const openProductModal = (product) => {
    setViewingProduct(product);
  };

  const closeProductModal = () => {
    setViewingProduct(null);
  };

  // Checkout function - Send to Facebook Messenger
  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderItems = cart.map(item => `• ${item.name} (x${item.quantity}): ${(item.price * item.quantity).toLocaleString()}đ`).join('%0A');
    
    // Create formatted message for Facebook Messenger
    const message = `Chào Mơ Nguyễn Makeup &Studio! 🌸%0A%0A📋 Tôi muốn đặt mua:%0A${orderItems}%0A%0A💰 Tổng cộng: ${total.toLocaleString()}đ%0A%0A🙏 Mong shop xác nhận đơn hàng giúp em ạ!`;
    
    // Facebook Page ID or username - Replace with your actual Facebook Page
    const facebookPageUsername = "moneguyen.makeup"; // Thay bằng username Facebook Page của bạn
    const messengerUrl = `https://m.me/${facebookPageUsername}?text=${message}`;
    
    // Open Facebook Messenger
    if (typeof window !== 'undefined') {
      window.open(messengerUrl, '_blank');
    }
    
    // Clear cart after sending
    setTimeout(() => {
      clearCart();
      setIsCartOpen(false);
    }, 1000);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#fdfbf7', padding: '10px 16px' }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          .font-serif-display { font-family: 'Cormorant Garamond', serif; }
          .font-body { font-family: 'Montserrat', sans-serif; }
          .product-grid { 
            display: grid; 
            grid-template-columns: repeat(4, 1fr); 
            gap: 16px; 
            margin-top: 32px; 
          }
          @media (max-width: 1024px) {
            .product-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; }
          }
          @media (max-width: 768px) {
            .product-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 24px; }
          }
          @media (max-width: 480px) {
            .product-grid { grid-template-columns: 1fr; gap: 20px; max-width: 350px; margin: 24px auto 0; }
          }
          .product-card { 
            background: white; 
            border-radius: 10px; 
            padding: 20px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .product-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          .nav-bar { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            background: white; 
            padding: 20px 24px; 
            border-radius: 12px; 
            margin-bottom: 32px; 
          }
          @media (max-width: 768px) {
            .nav-bar { padding: 16px 20px; margin-bottom: 24px; }
            .nav-bar > div:nth-child(2) { display: none !important; }
            .nav-bar > div:nth-child(3) > div:first-child { display: none; }
          }
          @media (max-width: 480px) {
            .nav-bar { padding: 12px 16px; border-radius: 8px; }
          }
        `
      }} />
      
      {/* Simple Debug Panel
      <div style={{ position: 'fixed', top: '10px', left: '10px', background: 'red', color: 'white', padding: '10px', borderRadius: '8px', zIndex: 1000 }}>
        <button 
          onClick={() => alert('Test button works!')} 
          style={{ display: 'block', background: 'blue', color: 'white', border: 'none', padding: '5px 10px', margin: '5px 0', borderRadius: '4px', cursor: 'pointer' }}
        >
          Test
        </button>
        <button 
          onClick={goHome} 
          style={{ display: 'block', background: 'green', color: 'white', border: 'none', padding: '5px 10px', margin: '5px 0', borderRadius: '4px', cursor: 'pointer' }}
        >
          Home
        </button>
        <button 
          onClick={toggleCart}
          style={{ background: 'orange', color: 'white', border: 'none', padding: '5px 10px', margin: '5px 0', borderRadius: '4px', cursor: 'pointer' }}
        >
          Cart ({cartItemCount})
        </button>
      </div> */}

      {/* Enhanced Navigation Header */}
      <div className="nav-bar" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fdfbf7 100%)', border: '1px solid #f0f0f0' }}>
        <button 
          onClick={goHome}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '18px' : '24px', fontWeight: 'bold' }}
        >
          <div style={{ 
            width: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '32px' : '40px', 
            height: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '32px' : '40px', 
            background: '#8B0000', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#D4AF37' 
          }}>
            <Camera size={(typeof window !== 'undefined' && window.innerWidth <= 480) ? 16 : 20} />
          </div>
          <span style={{ color: '#2c1810' }}>Mơ Nguyễn Makeup & Studio</span>
        </button>

        {/* Center Menu - Hidden on mobile */}
        <div className="hidden md:flex space-x-6 lg:space-x-8 font-body font-medium text-sm tracking-wide text-[#2c1810]">
          <button onClick={goHome} className="hover:text-[#D4AF37] transition-colors whitespace-nowrap">
            TRANG CHỦ
          </button>
          <button onClick={() => window.location.href = '/#gallery'} className="hover:text-[#D4AF37] transition-colors whitespace-nowrap">
            THƯ VIỆN ẢNH
          </button>
          <button onClick={() => window.location.href = '/#pricing'} className="hover:text-[#D4AF37] transition-colors whitespace-nowrap">
            BẢNG GIÁ
          </button>
          <span className="text-[#8B0000] font-bold bg-[#8B0000] text-white px-3 py-2 rounded-md text-xs whitespace-nowrap">
            PHỤ KIỆN
          </span>
          <button onClick={() => window.location.href = '/#ai-consultant'} className="hover:text-[#D4AF37] transition-colors flex items-center gap-1 whitespace-nowrap">
            <Sparkles size={14}/> AI CONCEPT
          </button>
          <button onClick={() => window.location.href = '/#contact'} className="hover:text-[#D4AF37] transition-colors whitespace-nowrap">
            LIÊN HỆ
          </button>
        </div>

        

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '8px' : '16px' }}>
          <div style={{ fontSize: '12px', color: '#666', textAlign: 'right' }}>
            <div style={{ fontWeight: '600', color: '#8B0000' }}>Hotline: 0123.456.789</div>
            <div>Giao hàng toàn quốc</div>
          </div>
          <button 
            onClick={toggleCart}
            style={{ 
              background: '#f8f8f8', 
              border: 'none', 
              cursor: 'pointer', 
              position: 'relative', 
              padding: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '6px' : '8px', 
              borderRadius: '50%' 
            }}
          >
            <ShoppingBag size={(typeof window !== 'undefined' && window.innerWidth <= 480) ? 20 : 24} color="#8B0000" />
            {cartItemCount > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: '-2px', 
                right: '-2px', 
                background: '#D4AF37', 
                color: 'white', 
                borderRadius: '50%', 
                width: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '16px' : '18px', 
                height: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '16px' : '18px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '10px' : '11px',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                {cartItemCount}
              </span>
            )}
          </button>
          
          {/* Hamburger Menu Button - Only on mobile */}
          <button 
            className="md:hidden"
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              padding: '8px',
              borderRadius: '4px',
              display: (typeof window !== 'undefined' && window.innerWidth <= 768) ? 'block' : 'none'
            }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div style={{ width: '20px', height: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ 
                background: '#2c1810', 
                display: 'block', 
                transition: 'all 0.3s ease-out', 
                height: '2px', 
                width: '20px', 
                borderRadius: '1px',
                transform: isMobileMenuOpen ? 'rotate(45deg) translateY(6px)' : 'translateY(-6px)'
              }}></span>
              <span style={{ 
                background: '#2c1810', 
                display: 'block', 
                transition: 'all 0.3s ease-out', 
                height: '2px', 
                width: '20px', 
                borderRadius: '1px',
                margin: '4px 0',
                opacity: isMobileMenuOpen ? 0 : 1
              }}></span>
              <span style={{ 
                background: '#2c1810', 
                display: 'block', 
                transition: 'all 0.3s ease-out', 
                height: '2px', 
                width: '20px', 
                borderRadius: '1px',
                transform: isMobileMenuOpen ? 'rotate(-45deg) translateY(-6px)' : 'translateY(6px)'
              }}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {typeof window !== 'undefined' && window.innerWidth <= 768 && (
        <div style={{ 
          overflow: 'hidden', 
          transition: 'all 0.3s ease-out', 
          maxHeight: isMobileMenuOpen ? '200px' : '0px', 
          opacity: isMobileMenuOpen ? 1 : 0,
          background: 'white',
          borderRadius: '8px',
          marginBottom: isMobileMenuOpen ? '16px' : '0px',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              onClick={goHome}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#666', 
                cursor: 'pointer', 
                textAlign: 'left', 
                fontSize: '14px',
                fontWeight: '500',
                padding: '8px 0',
                transition: 'color 0.2s'
              }}
            >
              TRANG CHỦ
            </button>
            <button 
              onClick={() => window.location.href = '/#gallery'}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#666', 
                cursor: 'pointer', 
                textAlign: 'left', 
                fontSize: '14px',
                fontWeight: '500',
                padding: '8px 0',
                transition: 'color 0.2s'
              }}
            >
              THƯ VIỆN ẢNH
            </button>
            <button 
              onClick={() => window.location.href = '/#pricing'}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#666', 
                cursor: 'pointer', 
                textAlign: 'left', 
                fontSize: '14px',
                fontWeight: '500',
                padding: '8px 0',
                transition: 'color 0.2s'
              }}
            >
              BẢNG GIÁ
            </button>
            <div style={{ 
              color: '#8B0000', 
              fontWeight: 'bold', 
              fontSize: '14px',
              padding: '8px 0'
            }}>
              PHỤ KIỆN
            </div>
            <button 
              onClick={() => window.location.href = '/#ai-consultant'}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#666', 
                cursor: 'pointer', 
                textAlign: 'left', 
                fontSize: '14px',
                fontWeight: '500',
                padding: '8px 0',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              ✨ AI CONCEPT
            </button>
            <button 
              onClick={() => window.location.href = '/#contact'}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#666', 
                cursor: 'pointer', 
                textAlign: 'left', 
                fontSize: '14px',
                fontWeight: '500',
                padding: '8px 0',
                transition: 'color 0.2s'
              }}
            >
              LIÊN HỆ
            </button>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        marginBottom: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '24px' : '40px', 
        color: '#666', 
        fontSize: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '12px' : '14px' 
      }}>
        <button onClick={goHome} style={{ 
          background: 'none', 
          border: 'none', 
          color: '#666', 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px',
          fontSize: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '12px' : '14px'
        }}>
          <ArrowLeft size={(typeof window !== 'undefined' && window.innerWidth <= 480) ? 12 : 14} /> Trang chủ
        </button>
        <span>/</span>
        <span style={{ color: '#2c1810', fontWeight: 'bold' }}>Cửa hàng</span>
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '24px' : '32px' }}>
        <h1 className="font-serif-display" style={{ 
          fontSize: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '28px' : (typeof window !== 'undefined' && window.innerWidth <= 768) ? '36px' : '42px', 
          fontWeight: 'bold', 
          color: '#2c1810', 
          margin: '0 0 6px 0' 
        }}>
          Cửa Hàng Phụ Kiện
        </h1>
        <div style={{ 
          width: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '40px' : '60px', 
          height: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '2px' : '3px', 
          background: '#D4AF37', 
          margin: '0 auto', 
          borderRadius: '2px' 
        }}></div>
      </div>

    {/* Products Grid */}
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
            <div style={{ width: '100%', paddingBottom: '100%', position: 'relative', borderRadius: '6px', overflow: 'hidden', marginBottom: '12px' }}>
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
            <div style={{ 
              fontSize: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '10px' : '11px', 
              color: '#666', 
              marginBottom: '6px', 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px' 
            }}>
              {product.category}
            </div>
            <h3 style={{ 
              fontSize: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '16px' : '16px', 
              fontWeight: 'bold', 
              color: '#2c1810', 
              margin: '0 0 14px 0', 
              lineHeight: '1.3' 
            }}>
              {product.name}
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ 
                fontSize: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '16px' : '16px', 
                fontWeight: 'bold', 
                color: '#8B0000' 
              }}>
                {product.price.toLocaleString()}đ
              </span>
              <div style={{ display: 'flex', gap: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '6px' : '6px' }}>
                <button 
                onClick={() => openProductModal(product)}
                style={{ 
                  background: '#8B0000', 
                  color: 'white', 
                  border: 'none', 
                  padding: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '6px 12px' : '6px 10px', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  fontSize: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '12px' : '11px',
                  fontWeight: '500'
                }}
                >
                Xem
                </button>
                <button 
                onClick={() => addToCart(product)}
                aria-label={`Thêm ${product.name} vào giỏ`}
                title="Thêm vào giỏ"
                style={{ 
                  background: '#D4AF37', 
                  color: 'white', 
                  border: 'none', 
                  padding: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '6px' : '6px', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '34px' : '32px',
                  height: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '34px' : '32px'
                }}
                >
                <ShoppingBag size={(typeof window !== 'undefined' && window.innerWidth <= 480) ? 16 : 16} />
                </button>
              </div>
            </div>
            </div>
          ))}
        </div>

        {/* Full Cart Drawer */}
      {isCartOpen && (
        <div style={{ 
          position: 'fixed', 
          top: '0', 
          left: '0', 
          right: '0', 
          bottom: '0', 
          background: 'rgba(0,0,0,0.5)', 
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <div 
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={toggleCart}
          ></div>
          <div style={{ 
            background: 'white', 
            width: '100%',
            maxWidth: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '100%' : '400px',
            height: '100%',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Cart Header */}
            <div style={{ 
              padding: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '16px' : '24px', 
              borderBottom: '1px solid #eee', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              background: '#fdfbf7'
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '20px' : '24px', 
                fontWeight: 'bold' 
              }}>
                Giỏ Hàng
              </h3>
              <button 
                onClick={toggleCart}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  padding: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '4px' : '8px' 
                }}
              >
                <CloseIcon size={(typeof window !== 'undefined' && window.innerWidth <= 480) ? 20 : 24} />
              </button>
            </div>

            {/* Cart Items */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              padding: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '16px' : '24px' 
            }}>
              {cart.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  color: '#666', 
                  marginTop: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '20px' : '40px',
                  fontSize: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '14px' : '16px' 
                }}>
                  Giỏ hàng trống
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} style={{ 
                    display: 'flex', 
                    gap: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '12px' : '16px', 
                    marginBottom: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '16px' : '24px' 
                  }}>
                    <img 
                      src={item.image} 
                      style={{ 
                        width: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '60px' : '80px', 
                        height: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '60px' : '80px', 
                        objectFit: 'cover', 
                        borderRadius: '8px' 
                      }} 
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '12px' : '14px', 
                        fontWeight: 'bold' 
                      }}>
                        {item.name}
                      </h4>
                      <p style={{ 
                        margin: '0 0 12px 0', 
                        color: '#8B0000', 
                        fontWeight: 'bold',
                        fontSize: (typeof window !== 'undefined' && window.innerWidth <= 480) ? '12px' : '14px'
                      }}>
                        {item.price.toLocaleString()}đ
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '6px' }}>
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ padding: '0 12px' }}>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: '4px' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div style={{ 
                padding: '24px', 
                borderTop: '1px solid #eee', 
                background: '#fdfbf7' 
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '16px',
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}>
                  <span>Tổng:</span>
                  <span style={{ color: '#8B0000' }}>{cartTotal.toLocaleString()}đ</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  style={{ 
                    width: '100%',
                    background: '#1877F2',
                    color: 'white',
                    border: 'none',
                    padding: '16px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(24, 119, 242, 0.3)'
                  }}
                >
                  📱 Đặt Hàng Qua Messenger
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {viewingProduct && (
        <div style={{ 
          position: 'fixed', 
          top: '0', 
          left: '0', 
          right: '0', 
          bottom: '0', 
          background: 'rgba(0,0,0,0.7)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '16px',
          zIndex: 3000
        }}>
          <div 
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={closeProductModal}
          ></div>
          <div style={{ 
            background: 'white', 
            borderRadius: '20px', 
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: (typeof window !== 'undefined' && window.innerWidth > 768) ? '1fr 1fr' : '1fr',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
          }}>
            <button 
              onClick={closeProductModal}
              style={{ 
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255,255,255,0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                cursor: 'pointer',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'all 0.2s ease'
              }}
            >
              <CloseIcon size={24} color="#666" />
            </button>
            
            {/* Product Image */}
            <div style={{ height: (typeof window !== 'undefined' && window.innerWidth > 768) ? 'auto' : '280px', position: 'relative', borderRadius: '20px 0 0 20px', overflow: 'hidden' }}>
              <img 
                src={viewingProduct.image} 
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }} 
              />
              <div style={{ 
                position: 'absolute', 
                top: '20px', 
                left: '20px',
                background: '#8B0000',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {viewingProduct.category}
              </div>
            </div>
            
            {/* Product Info */}
            <div style={{ padding: (typeof window !== 'undefined' && window.innerWidth > 768) ? '40px' : '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {/* Product Name */}
              <h3 style={{ 
                fontSize: (typeof window !== 'undefined' && window.innerWidth > 768) ? '36px' : '28px', 
                fontWeight: 'bold', 
                margin: '0 0 8px 0',
                fontFamily: "'Cormorant Garamond', serif",
                color: '#2c1810',
                lineHeight: '1.2'
              }}>
                {viewingProduct.name}
              </h3>
              
              {/* Star Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1,2,3,4,5].map(star => (
                    <span key={star} style={{ color: '#D4AF37', fontSize: '18px' }}>★</span>
                  ))}
                </div>
                <span style={{ color: '#666', fontSize: '14px' }}>(24 đánh giá)</span>
              </div>
              
              {/* Price */}
              <div style={{ marginBottom: '24px' }}>
                <p style={{ 
                  fontSize: (typeof window !== 'undefined' && window.innerWidth > 768) ? '40px' : '32px', 
                  color: '#8B0000', 
                  fontWeight: 'bold', 
                  margin: '0',
                  fontFamily: "'Cormorant Garamond', serif"
                }}>
                  {viewingProduct.price.toLocaleString()}đ
                </p>
                <p style={{ 
                  fontSize: '14px',
                  color: '#666',
                  margin: '4px 0 0 0',
                  textDecoration: 'line-through'
                }}>
                  {Math.round(viewingProduct.price * 1.3).toLocaleString()}đ
                </p>
              </div>
              
              {/* Description */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  color: '#2c1810', 
                  margin: '0 0 12px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Mô tả sản phẩm
                </h4>
                <p style={{ 
                  color: '#666', 
                  lineHeight: '1.6',
                  margin: '0',
                  fontSize: '14px'
                }}>
                  {viewingProduct.description}
                </p>
                
                {/* Product Features */}
                <div style={{ marginTop: '16px' }}>
                  <ul style={{ margin: '0', padding: '0', listStyle: 'none' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px', color: '#666' }}>
                      <span style={{ color: '#22c55e' }}>✓</span>
                      Chất lượng cao, an toàn cho da
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px', color: '#666' }}>
                      <span style={{ color: '#22c55e' }}>✓</span>
                      Giao hàng nhanh toàn quốc
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px', color: '#666' }}>
                      <span style={{ color: '#22c55e' }}>✓</span>
                      Bảo hành 30 ngày
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Quantity Selector */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  color: '#2c1810', 
                  margin: '0 0 12px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Số lượng
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #f0f0f0', borderRadius: '12px', width: 'fit-content' }}>
                  <button style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    padding: '12px 16px',
                    fontSize: '18px',
                    color: '#666'
                  }}>
                    <Minus size={16} />
                  </button>
                  <span style={{ padding: '0 16px', fontSize: '16px', fontWeight: 'bold' }}>1</span>
                  <button style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    padding: '12px 16px',
                    fontSize: '18px',
                    color: '#666'
                  }}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: (typeof window !== 'undefined' && window.innerWidth > 768) ? 'row' : 'column', gap: '12px' }}>
                <button 
                  onClick={() => { 
                    addToCart(viewingProduct); 
                    closeProductModal();
                  }}
                  style={{ 
                    flex: 1,
                    background: '#8B0000',
                    color: 'white',
                    border: 'none',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(139, 0, 0, 0.3)'
                  }}
                >
                  <ShoppingBag size={20} /> Thêm Vào Giỏ
                </button>
                
                {/* Buy Now Button */}
                <button 
                  onClick={() => { 
                    addToCart(viewingProduct); 
                    closeProductModal();
                    setIsCartOpen(true);
                  }}
                  style={{ 
                    flex: 1,
                    background: '#D4AF37',
                    color: 'white',
                    border: 'none',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
                  }}
                >
                  Mua Ngay
                </button>
              </div>
              
              {/* Additional Info */}
              <div style={{ 
                marginTop: '24px', 
                padding: '16px', 
                background: '#f8f8f8', 
                borderRadius: '12px',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '16px' }}>🚚</span>
                  <span style={{ fontSize: '13px', color: '#666' }}>
                    <strong>Miễn phí vận chuyển</strong> cho đơn hàng trên 500.000đ
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '16px' }}>💬</span>
                  <span style={{ fontSize: '13px', color: '#666' }}>
                    Liên hệ <strong>0383.091.515</strong> để được tư vấn
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '16px' }}>📱</span>
                  <span style={{ fontSize: '13px', color: '#666' }}>
                    Đặt hàng qua <strong>Facebook Messenger</strong> nhanh chóng
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TetShopSimple;
