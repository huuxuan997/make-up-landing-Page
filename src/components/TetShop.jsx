import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowLeft, Plus, Minus, Trash2, X as CloseIcon, Menu, Camera, Share2, Check } from 'lucide-react';

// --- LOGIC GIỎ HÀNG (Tích hợp trực tiếp để tránh lỗi import) ---
const CART_KEY = 'xuan_studio_cart';

const getCart = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Lỗi đọc LocalStorage", e);
    return [];
  }
};

const saveCart = (cart) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
  } catch (e) {
    console.error("Lỗi lưu LocalStorage", e);
  }
};

const addToCart = (product) => {
  console.log('Adding to cart:', product); // Debug log
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    const newCart = cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
    saveCart(newCart);
  } else {
    saveCart([...cart, { ...product, quantity: 1 }]);
  }
  console.log('Cart updated'); // Debug log
};

const updateQuantity = (productId, delta) => {
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

const removeFromCart = (productId) => {
  const cart = getCart();
  const newCart = cart.filter(item => item.id !== productId);
  saveCart(newCart);
};

const clearCart = () => {
  saveCart([]);
};

const useCartStore = () => {
  const [cart, setCart] = useState([]);
  useEffect(() => {
    setCart(getCart());
    const handleStorageChange = () => setCart(getCart());
    window.addEventListener('cart-updated', handleStorageChange);
    return () => window.removeEventListener('cart-updated', handleStorageChange);
  }, []);
  return cart;
};
// --- KẾT THÚC LOGIC GIỎ HÀNG ---

// Chuyển dữ liệu ra ngoài component để dễ truy xuất
const products = [
  { id: 1, name: "Mi Giả Tự Nhiên", price: 59000, category: "Phụ Kiện", image: "https://images.unsplash.com/photo-1631214548051-331dc9b222ce?q=80&w=500&auto=format&fit=crop", description: "Mi giả sợi tơ mềm mại." },
  { id: 2, name: "Keo Xịt Tóc Butterfly", price: 120000, category: "Tóc & Makeup", image: "https://images.unsplash.com/photo-1624898144670-4f51950d24e6?q=80&w=500&auto=format&fit=crop", description: "Giữ nếp tóc suốt 24h." },
  { id: 3, name: "Lens Mắt Hổ Phách", price: 150000, category: "Lens", image: "https://images.unsplash.com/photo-1588656839369-122e2bb525e6?q=80&w=500&auto=format&fit=crop", description: "Lens giãn tròng nhẹ." },
  { id: 4, name: "Trâm Cài Tóc Cổ Trang", price: 250000, category: "Phụ Kiện", image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=500&auto=format&fit=crop", description: "Mạ vàng đính ngọc trai." },
  { id: 5, name: "Mi Giả Tự Nhiên", price: 59000, category: "Phụ Kiện", image: "https://images.unsplash.com/photo-1631214548051-331dc9b222ce?q=80&w=500&auto=format&fit=crop", description: "Mi giả sợi tơ mềm mại." },
  { id: 6, name: "Keo Xịt Tóc Butterfly", price: 120000, category: "Tóc & Makeup", image: "https://images.unsplash.com/photo-1624898144670-4f51950d24e6?q=80&w=500&auto=format&fit=crop", description: "Giữ nếp tóc suốt 24h." },
  { id: 7, name: "Lens Mắt Hổ Phách", price: 150000, category: "Lens", image: "https://images.unsplash.com/photo-1588656839369-122e2bb525e6?q=80&w=500&auto=format&fit=crop", description: "Lens giãn tròng nhẹ." },
  { id: 8, name: "Trâm Cài Tóc Cổ Trang", price: 250000, category: "Phụ Kiện", image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=500&auto=format&fit=crop", description: "Mạ vàng đính ngọc trai." }
];

const TetShop = () => {
  const cart = useCartStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Debug: Log khi component mount
  useEffect(() => {
    console.log('TetShop component mounted');
    console.log('React useState working:', isCartOpen);
  }, []);

  // Simplified test functions
  const handleTestClick = () => {
    console.log('React onClick handler fired!');
    alert('React button works!');
  };

  const handleGoHome = () => {
    console.log('Going home...');
    window.location.href = '/';
  };

  const handleOpenCart = () => {
    console.log('Opening cart...');
    setIsCartOpen(true);
  };

  // Xử lý Deep Link (URL Parameters)
  useEffect(() => {
    // 1. Kiểm tra URL khi mới vào trang
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    if (productId) {
      const product = products.find(p => p.id === parseInt(productId));
      if (product) setViewingProduct(product);
    }

    // 2. Lắng nghe sự kiện Back/Forward của trình duyệt để đóng/mở modal
    const handlePopState = () => {
      const currentParams = new URLSearchParams(window.location.search);
      const currentId = currentParams.get('product');
      if (currentId) {
        const product = products.find(p => p.id === parseInt(currentId));
        setViewingProduct(product || null);
      } else {
        setViewingProduct(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Hàm mở modal và cập nhật URL
  const openProductModal = (product) => {
    setViewingProduct(product);
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('product', product.id);
    window.history.pushState({}, '', newUrl);
  };

  // Hàm đóng modal và xóa tham số URL
  const closeProductModal = () => {
    setViewingProduct(null);
    const newUrl = new URL(window.location);
    newUrl.searchParams.delete('product');
    window.history.pushState({}, '', newUrl);
  };

  // Hàm copy link sản phẩm
  const copyProductLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCheckout = () => {
    const orderItems = cart.map(item => `- ${item.name} (x${item.quantity}): ${(item.price * item.quantity).toLocaleString()}đ`).join('\n');
    const message = `Chào XuanStudio, tôi muốn đặt mua:\n${orderItems}\n\nTổng cộng: ${cartTotal.toLocaleString()}đ`;
    alert(`Đơn hàng đã gửi!\n${message}`);
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] font-sans text-[#2c1810]">
      <style>{`.font-serif-display { font-family: 'Cormorant Garamond', serif; } .font-body { font-family: 'Montserrat', sans-serif; }`}</style>

      {/* TEST BUTTONS - Để debug với simplified handlers */}
      <div className="fixed top-0 left-0 z-50 bg-red-500 text-white p-2 space-y-2">
        <button onClick={handleTestClick} className="block bg-blue-500 px-4 py-2 rounded">
          React Test Button
        </button>
        <button onClick={handleGoHome} className="block bg-green-500 px-4 py-2 rounded">
          Go Home
        </button>
        <button onClick={handleOpenCart} className="block bg-yellow-500 px-4 py-2 rounded text-black">
          Open Cart
        </button>
      </div>

      {/* Navigation */}
      <nav className="fixed w-full z-40 bg-white/95 backdrop-blur-sm shadow-md py-3 sm:py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <a href="/" className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#8B0000] rounded-full flex items-center justify-center text-[#D4AF37]">
              <Camera size={16} className="sm:w-[20px] sm:h-[20px]" />
            </div>
            <span className="font-serif-display text-lg sm:text-xl md:text-2xl font-bold text-[#2c1810]">Mơ Nguyễn Studio</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 lg:space-x-8 font-body font-medium text-sm">
            <a href="/" className="hover:text-[#D4AF37] transition-colors">TRANG CHỦ</a>
            <span className="text-[#8B0000] font-bold border-b-2 border-[#8B0000]">CỬA HÀNG</span>
          </div>

          {/* Right Side - Cart + Hamburger */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-[#2c1810]">
              <ShoppingBag size={20} className="sm:w-[24px] sm:h-[24px]" />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-[#8B0000] text-white text-[10px] w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full font-bold animate-bounce">{cart.reduce((a, b) => a + b.quantity, 0)}</span>}
            </button>
            
            {/* Hamburger Menu Button */}
            <button 
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="w-5 h-5 flex flex-col justify-center items-center">
                <span className={`bg-[#2c1810] block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
                <span className={`bg-[#2c1810] block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm my-0.5 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`bg-[#2c1810] block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${isMobileMenuOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            <a href="/" className="block text-gray-700 hover:text-[#8B0000] font-medium transition-colors">
              Trang Chủ
            </a>
            <div className="block text-[#8B0000] font-bold">
              Cửa Hàng
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-6 sm:mb-8 text-gray-500 text-sm">
            <a href="/" className="hover:text-[#8B0000] flex items-center"><ArrowLeft size={14} className="mr-1"/> Trang chủ</a>
            <span>/</span>
            <span className="text-[#2c1810] font-bold">Cửa hàng</span>
        </div>

        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#2c1810] mb-2">Cửa Hàng Phụ Kiện</h1>
          <div className="h-1 w-16 sm:w-20 bg-[#D4AF37] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-6 lg:gap-8">
            {products.map(product => (
              <div key={product.id} className="group transition-all duration-500 ease-out hover:-translate-y-2">
                <div className="h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col">
                  <div className="relative overflow-hidden aspect-square">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button onClick={() => openProductModal(product)} className="bg-white text-[#2c1810] px-4 py-2 md:px-6 md:py-2 rounded-full font-bold text-sm hover:bg-[#D4AF37] hover:text-white transition-colors">Xem Nhanh</button>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6 flex-1 flex flex-col">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{product.category}</div>
                    <h3 className="font-serif-display text-xl sm:text-xl font-bold text-[#2c1810] mb-3 line-clamp-2 cursor-pointer hover:text-[#8B0000] leading-tight min-h-[3rem] sm:min-h-[3rem]" onClick={() => openProductModal(product)}>{product.name}</h3>
                    <div className="mt-auto pt-3 sm:pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[#8B0000] font-bold text-xl sm:text-xl">{product.price.toLocaleString()}đ</span>
                        <button 
                          onClick={(e) => { 
                            console.log('Add to cart button clicked for:', product.name); 
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart(product); 
                            setIsCartOpen(true); 
                          }} 
                          className="p-3 sm:p-3 bg-gray-100 rounded-full hover:bg-[#2c1810] hover:text-white transition-all duration-300 group-hover:scale-110"
                        >
                          <ShoppingBag size={18} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Cart Drawer */}
      <div className={`fixed inset-0 z-50 pointer-events-none overflow-hidden ${isCartOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
        <div className={`absolute inset-0 bg-black/40 pointer-events-auto transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsCartOpen(false)}></div>
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl pointer-events-auto transform transition-transform duration-300 ease-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#fdfbf7]">
            <h3 className="font-serif-display text-2xl font-bold">Giỏ Hàng</h3>
            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><CloseIcon size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? <div className="text-center text-gray-400 mt-10">Giỏ hàng trống</div> : cart.map(item => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.image} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{item.name}</h4>
                    <p className="text-[#8B0000] font-bold">{item.price.toLocaleString()}đ</p>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="flex border rounded-lg"><button onClick={() => updateQuantity(item.id, -1)} className="p-1"><Minus size={14}/></button><span className="px-2">{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} className="p-1"><Plus size={14}/></button></div>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                    </div>
                  </div>
                </div>
            ))}
          </div>
          <div className="p-6 border-t bg-[#fdfbf7]">
              <div className="flex justify-between mb-4 font-bold text-xl"><span>Tổng:</span><span className="text-[#8B0000]">{cartTotal.toLocaleString()}đ</span></div>
              <button onClick={handleCheckout} disabled={cart.length === 0} className="w-full bg-[#2c1810] text-[#D4AF37] py-4 rounded-xl font-bold uppercase hover:bg-[#4a2c20] disabled:opacity-50">Thanh Toán</button>
          </div>
        </div>
      </div>
      
      {/* Product Detail Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeProductModal}></div>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-10 grid grid-cols-1 md:grid-cols-2 shadow-2xl">
            <button onClick={closeProductModal} className="absolute top-4 right-4 z-20 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
              <CloseIcon size={20} className="sm:w-[24px] sm:h-[24px]" />
            </button>
            <div className="h-48 sm:h-64 md:h-full relative">
              <img src={viewingProduct.image} className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <h3 className="font-serif-display text-2xl sm:text-3xl font-bold mb-4">{viewingProduct.name}</h3>
              <p className="text-2xl sm:text-3xl text-[#8B0000] font-bold mb-4 sm:mb-6">{viewingProduct.price.toLocaleString()}đ</p>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">{viewingProduct.description}</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button 
                  onClick={() => { 
                    console.log('Modal add to cart clicked:', viewingProduct.name);
                    addToCart(viewingProduct); 
                    setIsCartOpen(true); 
                  }} 
                  className="flex-1 bg-[#2c1810] text-white py-3 sm:py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#4a2c20] transition-colors"
                >
                  <ShoppingBag size={18} className="sm:w-[20px] sm:h-[20px]" /> 
                  <span className="text-sm sm:text-base">Thêm Vào Giỏ</span>
                </button>
                <button onClick={copyProductLink} className="w-full sm:w-14 bg-gray-100 text-[#2c1810] py-3 sm:py-4 rounded-xl font-bold flex items-center justify-center hover:bg-gray-200 transition-colors" title="Copy link sản phẩm">
                  {copiedLink ? <Check size={18} className="sm:w-[20px] sm:h-[20px] text-green-600"/> : <Share2 size={18} className="sm:w-[20px] sm:h-[20px]" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TetShop;