import React, { useState, useEffect } from 'react';
import { Camera, Sparkles, Shirt, Crown, Check, X, Star, Menu, Phone, MapPin, Instagram, Facebook, ArrowRight, Wand2, Loader2 } from 'lucide-react';

const TetLandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentBookingPackage, setCurrentBookingPackage] = useState('');
  
  // State cho AI Feature
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Xử lý hiệu ứng cuộn header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  // Hàm gọi Gemini API
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiResult(null);

    // Lấy API Key từ biến môi trường (file .env)
    const apiKey = import.meta.env.PUBLIC_GEMINI_API_KEY; 

    if (!apiKey) {
      alert("Chưa cấu hình API Key trong file .env!");
      setIsAiLoading(false);
      return;
    }

    const systemPrompt = `Đóng vai trò là một Art Director chuyên nghiệp của studio chụp ảnh Tết (Mơ Nguyễn Makeup & Studio). 
    Khách hàng đang tìm ý tưởng chụp ảnh với mong muốn: "${aiPrompt}".
    Hãy sáng tạo một concept cụ thể.
    Yêu cầu trả về định dạng JSON thuần túy (không markdown) với các trường sau:
    - conceptName: Tên concept thật kêu và nghệ thuật (Tiếng Việt).
    - outfit: Gợi ý trang phục chi tiết (Tiếng Việt).
    - makeup: Gợi ý phong cách trang điểm và làm tóc (Tiếng Việt).
    - poses: Một mảng chứa 2 gợi ý tạo dáng cụ thể (Tiếng Việt).
    - caption: Một câu caption hoặc thơ ngắn thật hay, phù hợp để khách đăng Facebook kèm ảnh.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "OBJECT",
                properties: {
                  conceptName: { type: "STRING" },
                  outfit: { type: "STRING" },
                  makeup: { type: "STRING" },
                  poses: { type: "ARRAY", items: { type: "STRING" } },
                  caption: { type: "STRING" }
                }
              }
            }
          })
        }
      );

      const data = await response.json();
      const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (resultText) {
        setAiResult(JSON.parse(resultText));
      }
    } catch (error) {
      console.error("Lỗi khi gọi AI:", error);
      alert("Có lỗi xảy ra khi gọi AI. Vui lòng kiểm tra API Key hoặc thử lại sau.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Hàm để đặt lịch (hiển thị modal chọn cách liên hệ)
  const handleBooking = (packageName = '') => {
    setCurrentBookingPackage(packageName);
    setShowBookingModal(true);
  };

  // Hàm thực hiện liên hệ
  const handleContact = (method) => {
    const phoneNumber = "0383091515";
    let message = "Xin chào! Tôi muốn đặt lịch chụp ảnh Tết 2025";
    
    if (currentBookingPackage) {
      message += ` - ${currentBookingPackage}`;
    }
    
    setShowBookingModal(false);
    
    switch(method) {
      case 'zalo':
        window.open(`https://zalo.me/${phoneNumber}`, '_blank');
        break;
      case 'facebook':
        window.open("https://m.me/mo.nguyen.makeup.98", '_blank');
        break;
      case 'phone':
        window.open(`tel:${phoneNumber}`);
        break;
      default:
        break;
    }
  };

  // Dữ liệu các gói chụp
  const packages = [
    {
      id: 1,
      name: "Gói Du Xuân",
      price: "999.000",
      description: "Lựa chọn tiết kiệm cho những bức ảnh tự nhiên.",
      features: [
        { text: "Makeup & Làm tóc cơ bản", included: true },
        { text: "Chụp ảnh nghệ thuật", included: true },
        { text: "Nhận toàn bộ file gốc", included: true },
        { text: "Trang phục & Phụ kiện", included: false },
        { text: "Chỉnh sửa chi tiết ảnh", included: false },
      ],
      highlight: false,
      icon: <Camera className="w-6 h-6" />,
    },
    {
      id: 2,
      name: "Gói Nét Việt",
      price: "1.500.000",
      description: "Gói được yêu thích nhất với vẻ đẹp Áo Dài truyền thống.",
      features: [
        { text: "Makeup & Làm tóc chuyên nghiệp", included: true },
        { text: "Chụp ảnh nghệ thuật", included: true },
        { text: "Chỉnh sửa 10 ảnh cao cấp", included: true },
        { text: "01 Bộ Áo Dài thiết kế", included: true },
        { text: "Phụ kiện đi kèm đầy đủ", included: true },
      ],
      highlight: true,
      icon: <Shirt className="w-6 h-6" />,
    },
    {
      id: 3,
      name: "Gói Hoài Cổ",
      price: "1.800.000",
      description: "Trải nghiệm sự sang trọng với Cổ Phục Việt Nam.",
      features: [
        { text: "Makeup & Làm tóc concept", included: true },
        { text: "Chụp ảnh nghệ thuật", included: true },
        { text: "Chỉnh sửa 10 ảnh cao cấp", included: true },
        { text: "01 Bộ Cổ Phục cao cấp", included: true },
        { text: "Phụ kiện concept đầy đủ", included: true },
      ],
      highlight: false,
      icon: <Crown className="w-6 h-6" />,
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdfbf7] font-sans text-[#2c1810] overflow-x-hidden">
      <style>
        {`
          .font-serif-display { font-family: 'Cormorant Garamond', serif; }
          .font-body { font-family: 'Montserrat', sans-serif; }
          
          .bg-texture {
            background-image: radial-gradient(#d4af37 0.5px, transparent 0.5px), radial-gradient(#d4af37 0.5px, #fdfbf7 0.5px);
            background-size: 20px 20px;
            background-position: 0 0, 10px 10px;
            opacity: 0.1;
          }
          
          body {
            overflow-x: hidden;
          }
          
          * {
            box-sizing: border-box;
          }
        `}
      </style>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-3 md:py-4' : 'bg-transparent py-4 md:py-6'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center max-w-full">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#8B0000] rounded-full flex items-center justify-center text-[#D4AF37]">
              <Camera size={16} className="md:w-5 md:h-5" />
            </div>
            <span className={`font-serif-display text-base md:text-2xl font-bold ${isScrolled ? 'text-[#2c1810]' : 'text-[#2c1810] md:text-white'} truncate`}>
              Mơ Nguyễn Makeup & Studio
            </span>
          </div>

          {/* Desktop Menu */}
          <div className={`hidden md:flex space-x-6 lg:space-x-8 font-body font-medium text-sm tracking-wide ${isScrolled ? 'text-[#2c1810]' : 'text-white'}`}>
            <button onClick={() => scrollToSection('gallery')} className="hover:text-[#D4AF37] transition-colors whitespace-nowrap">THƯ VIỆN ẢNH</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-[#D4AF37] transition-colors whitespace-nowrap">BẢNG GIÁ</button>
            <button onClick={() => scrollToSection('ai-consultant')} className="hover:text-[#D4AF37] transition-colors flex items-center gap-1 whitespace-nowrap"><Sparkles size={14}/> AI CONCEPT</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-[#D4AF37] transition-colors whitespace-nowrap">LIÊN HỆ</button>
          </div>

          <button 
            className={`md:hidden p-2 rounded-lg ${isScrolled ? 'text-[#2c1810]' : 'text-[#2c1810]'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden flex flex-col p-4 space-y-4 font-body text-center border-t border-gray-100">
            <button onClick={() => scrollToSection('gallery')} className="py-2 text-gray-700 hover:text-[#8B0000]">Thư Viện Ảnh</button>
            <button onClick={() => scrollToSection('pricing')} className="py-2 text-gray-700 hover:text-[#8B0000]">Bảng Giá</button>
            <button onClick={() => scrollToSection('ai-consultant')} className="py-2 text-gray-700 hover:text-[#8B0000] flex items-center justify-center gap-2"><Sparkles size={16}/> Gợi Ý Concept AI</button>
            <button onClick={() => scrollToSection('contact')} className="py-2 text-gray-700 hover:text-[#8B0000]">Liên Hệ</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#2c1810]">
            <img 
              src="https://images.unsplash.com/photo-1548505298-0c6776101121?q=80&w=2000&auto=format&fit=crop" 
              alt="Tet Photography Background" 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#fdfbf7]"></div>
        </div>

        <div className="relative z-10 text-center px-4 md:px-4 max-w-4xl mx-auto space-y-6 md:space-y-6 animate-fade-in-up">
          <div className="inline-block border border-[#D4AF37]/50 px-4 py-2 md:px-4 rounded-full bg-black/20 backdrop-blur-sm">
             <span className="text-[#D4AF37] font-body text-xs md:text-sm uppercase tracking-[0.2em]">Lịch chụp Tết 2025 đã mở</span>
          </div>
          <h1 className="font-serif-display text-4xl md:text-7xl lg:text-8xl text-white font-bold leading-tight">
            Nét Duyên Dáng <br/> <span className="italic text-[#D4AF37]">Mùa Xuân</span>
          </h1>
          <p className="font-body text-gray-200 text-lg md:text-xl font-light max-w-2xl mx-auto px-0 md:px-0">
            Lưu giữ khoảnh khắc thanh xuân rực rỡ nhất của bạn trong tà áo dài truyền thống và không gian Tết đậm chất nghệ thuật.
          </p>
          <div className="pt-6 md:pt-8">
            <button 
              onClick={() => scrollToSection('pricing')}
              className="group bg-[#8B0000] text-white px-8 py-4 md:px-8 md:py-4 rounded-full font-body font-semibold text-sm md:text-sm uppercase tracking-widest hover:bg-[#a00000] transition-all duration-300 shadow-lg hover:shadow-[#8B0000]/50 inline-flex items-center space-x-2"
            >
              <span>Xem Bảng Giá</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section id="gallery" className="py-16 md:py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif-display text-3xl md:text-5xl text-[#2c1810] font-bold mb-4">Góc Ảnh Nghệ Thuật</h2>
            <div className="h-1 w-20 bg-[#D4AF37] mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-600 font-body font-light">Các concept đang được yêu thích nhất</p>
          </div>

          {/* Mobile Gallery Grid */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            <div className="rounded-2xl overflow-hidden relative group h-64">
              <img 
                src="/IMG_2120.JPG"
                alt="Áo Dài Studio"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 flex items-end p-6">
                <p className="text-white font-serif-display text-xl italic">Áo Dài Phố Cổ</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden relative group h-48">
                <img 
                  src="/IMG_2121.JPG"
                  alt="Studio Portrait"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <div className="rounded-2xl overflow-hidden relative group h-48">
                <img 
                  src="/IMG_2122.JPG"
                  alt="Studio Indoor"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden relative group h-64">
              <img 
                src="/IMG_2123.JPG"
                alt="Studio Concept"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 flex items-end p-6">
                 <p className="text-white font-serif-display text-xl italic">Vườn Xuân</p>
              </div>
            </div>
          </div>

          {/* Desktop Gallery Grid */}
          <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-4 h-[500px]">
            <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden relative group">
              <img 
                src="/IMG_2120.JPG"
                alt="Áo Dài Studio"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-6">
                <p className="text-white font-serif-display text-2xl italic">Áo Dài Phố Cổ</p>
              </div>
            </div>
            <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden relative group">
              <img 
                src="/IMG_2121.JPG"
                alt="Studio Portrait"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
            </div>
            <div className="col-span-1 row-span-2 rounded-2xl overflow-hidden relative group">
              <img 
                src="/IMG_2123.JPG"
                alt="Studio Concept"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-end p-6">
                 <p className="text-white font-serif-display text-xl italic">Vườn Xuân</p>
              </div>
            </div>
             <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden relative group">
              <img 
                src="/IMG_2122.JPG"
                alt="Studio Indoor"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-16 md:py-20 bg-white/50 overflow-hidden">
        <div className="absolute inset-0 bg-texture pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-red-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-yellow-50 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-60"></div>

        <div className="relative container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <div className="inline-flex items-center justify-center space-x-2 text-[#8B0000] mb-2">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
              <span className="uppercase tracking-[0.2em] text-xs md:text-sm font-medium">Bảng Giá Mới Nhất</span>
              <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <h2 className="font-serif-display text-3xl md:text-6xl text-[#2c1810] font-bold">
              Chụp Ảnh Tết 2025
            </h2>
            <div className="h-1 w-20 md:w-24 bg-[#D4AF37] mx-auto rounded-full my-4 md:my-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {packages.map((pkg) => (
              <div 
                key={pkg.id}
                className={`
                  relative group transition-all duration-500 ease-out
                  ${pkg.highlight ? 'md:-mt-8 z-10' : 'mt-0'}
                `}
              >
                <div className={`
                  h-full bg-white relative overflow-hidden rounded-2xl
                  transition-all duration-300 hover:shadow-2xl hover:-translate-y-2
                  ${pkg.highlight 
                    ? 'border-2 border-[#D4AF37] shadow-xl' 
                    : 'border border-gray-100 shadow-lg'
                  }
                `}>
                  {pkg.highlight && (
                    <div className="absolute top-0 inset-x-0">
                      <div className="bg-[#8B0000] text-[#D4AF37] text-xs font-bold uppercase tracking-widest text-center py-2">
                        Khuyên Dùng
                      </div>
                    </div>
                  )}

                  <div className={`p-6 md:p-8 text-center ${pkg.highlight ? 'pt-12 md:pt-12' : ''}`}>
                    <div className={`
                      w-12 h-12 md:w-14 md:h-14 mx-auto rounded-full flex items-center justify-center mb-4 md:mb-6 transition-colors duration-300
                      ${pkg.highlight ? 'bg-[#fff9e6] text-[#D4AF37]' : 'bg-gray-50 text-gray-400 group-hover:bg-[#fff0f0] group-hover:text-[#8B0000]'}
                    `}>
                      {pkg.icon}
                    </div>
                    <h3 className="font-serif-display text-xl md:text-2xl font-bold text-[#2c1810] mb-2">{pkg.name}</h3>
                    <div className="flex items-start justify-center text-[#8B0000] font-serif-display font-bold mb-4">
                      <span className="text-xl md:text-2xl mt-1 md:mt-2">₫</span>
                      <span className="text-3xl md:text-5xl">{pkg.price}</span>
                    </div>
                    <p className="text-gray-500 text-sm font-body font-light px-2 md:px-4 min-h-[40px]">{pkg.description}</p>
                  </div>

                  <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                  <div className="p-6 md:p-8">
                    <ul className="space-y-3 md:space-y-4">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          {feature.included ? (
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f0f9f4] flex items-center justify-center mt-0.5">
                              <Check className="w-3 h-3 text-green-600" />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center mt-0.5">
                              <X className="w-3 h-3 text-gray-300" />
                            </div>
                          )}
                          <span className={`font-body text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400 line-through decoration-gray-300'}`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-8 pt-0">
                    <button 
                      onClick={() => handleBooking(pkg.name)}
                      className={`
                      w-full py-4 px-6 rounded-xl font-body font-semibold text-sm uppercase tracking-wider transition-all duration-300
                      ${pkg.highlight 
                        ? 'bg-[#8B0000] text-white hover:bg-[#680000] shadow-md hover:shadow-lg' 
                        : 'bg-white border border-[#2c1810] text-[#2c1810] hover:bg-[#2c1810] hover:text-white'
                      }
                    `}>
                      Đặt Lịch Ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Consultant Section */}
      <section id="ai-consultant" className="py-16 md:py-20 bg-[#2c1810] relative overflow-hidden text-[#fdfbf7]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-[#D4AF37] rounded-full blur-[100px] opacity-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 md:mb-12">
            <div className="inline-flex items-center justify-center space-x-2 text-[#D4AF37] mb-2">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
              <span className="uppercase tracking-[0.2em] text-xs md:text-sm font-medium">Trợ Lý Ảo Mơ Nguyễn</span>
            </div>
            <h2 className="font-serif-display text-3xl md:text-5xl font-bold mb-4">Bạn Chưa Chọn Được Concept?</h2>
            <p className="font-body text-gray-300 max-w-2xl mx-auto font-light text-base md:text-base px-4 md:px-0">
              Đừng lo, hãy chia sẻ sở thích của bạn (màu sắc, tâm trạng, phong cách...), Stylist AI của chúng tôi sẽ gợi ý ngay một concept hoàn hảo dành riêng cho bạn.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-10 border border-[#D4AF37]/30 shadow-2xl">
            <div className="flex flex-col gap-4 mb-6 md:mb-8">
              <input 
                type="text" 
                placeholder="Ví dụ: Tôi muốn chụp kiểu hoài cổ, mặc áo dài trắng, buồn man mác..." 
                className="w-full bg-white/10 border border-gray-600 rounded-xl px-6 py-4 md:px-6 md:py-4 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all font-body text-base md:text-base"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
              />
              <button 
                onClick={handleAiGenerate}
                disabled={isAiLoading || !aiPrompt.trim()}
                className="bg-[#D4AF37] text-[#2c1810] px-8 py-4 md:px-8 md:py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-[#bfa34b] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-base md:text-base"
              >
                {isAiLoading ? <Loader2 className="animate-spin" /> : <><Wand2 size={20} /> Gợi Ý ✨</>}
              </button>
            </div>

            {/* AI Result Display */}
            {aiResult && (
              <div className="animate-fade-in space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  {/* Left Column: Concept Info */}
                  <div className="space-y-6">
                    <div className="bg-[#8B0000]/20 p-4 md:p-6 rounded-xl border border-[#8B0000]/50">
                      <h3 className="text-[#D4AF37] font-serif-display text-xl md:text-2xl font-bold mb-2 flex items-center gap-2">
                        <Camera size={20}/> {aiResult.conceptName}
                      </h3>
                      <p className="text-gray-200 font-body text-sm leading-relaxed">{aiResult.outfit}</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-[#D4AF37] uppercase text-sm tracking-wide">Makeup & Hair</h4>
                      <p className="text-gray-300 font-light italic text-sm border-l-2 border-gray-600 pl-4">{aiResult.makeup}</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-[#D4AF37] uppercase text-sm tracking-wide">Gợi ý tạo dáng</h4>
                      <ul className="space-y-2">
                        {aiResult.poses.map((pose, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                            <span className="bg-[#D4AF37] text-[#2c1810] w-6 h-6 md:w-5 md:h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{idx + 1}</span>
                            {pose}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column: Caption & CTA */}
                  <div className="flex flex-col justify-between space-y-6">
                    <div className="bg-[#fdfbf7] p-4 md:p-6 rounded-xl shadow-lg transform hover:rotate-0 transition-transform duration-300">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded-full"></div>
                          <div className="h-2 w-16 md:w-20 bg-gray-200 rounded"></div>
                        </div>
                        <Facebook size={16} className="text-blue-600"/>
                      </div>
                      <p className="text-[#2c1810] font-serif-display text-base md:text-lg italic leading-relaxed mb-4">
                        "{aiResult.caption}"
                      </p>
                      <div className="text-[#8B0000] text-xs font-bold">#MoNguyenMakeup #Tet2025 #{aiResult.conceptName.replace(/\s+/g, '')}</div>
                    </div>

                    <div className="text-center">
                      <p className="text-gray-400 text-sm mb-3">Bạn thích concept này chứ?</p>
                      <button 
                        onClick={() => handleBooking(`Concept: ${aiResult.conceptName}`)}
                        className="w-full border border-[#D4AF37] text-[#D4AF37] py-3 rounded-xl hover:bg-[#D4AF37] hover:text-[#2c1810] transition-all uppercase font-bold text-sm"
                      >
                        Đặt lịch theo Concept này
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#2c1810] text-[#fdfbf7] py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                 <Camera size={24} className="text-[#D4AF37]" />
                 <span className="font-serif-display text-xl md:text-2xl font-bold text-[#D4AF37]">Mơ Nguyễn Makeup & Studio</span>
              </div>
              <p className="font-body text-gray-400 font-light text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                Chuyên cung cấp dịch vụ chụp ảnh nghệ thuật, áo dài, cổ phục với phong cách tinh tế và chuyên nghiệp hàng đầu.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-serif-display text-lg md:text-xl font-bold text-[#D4AF37] uppercase tracking-wider">Liên Hệ</h4>
              <ul className="space-y-3 font-body text-gray-300 text-sm">
                <li className="flex items-start justify-center md:justify-start space-x-3">
                  <MapPin size={16} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <span className="text-left">982 Cách Mạng Tháng 8, Hiệp Ninh, Tây Ninh</span>
                </li>
                <li className="flex items-center justify-center md:justify-start space-x-3">
                  <Phone size={16} className="text-[#D4AF37] flex-shrink-0" />
                  <span>038 309 1515 (Zalo/Hotline)</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-serif-display text-lg md:text-xl font-bold text-[#D4AF37] uppercase tracking-wider">Mạng Xã Hội</h4>
              <div className="flex justify-center md:justify-start space-x-4">
                <a href="https://www.facebook.com/mo.nguyen.makeup.98" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-[#2c1810] transition-all">
                  <Facebook size={18} />
                </a>
                <a href="https://www.facebook.com/mo.nguyen.makeup.98" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-[#2c1810] transition-all">
                  <Instagram size={18} />
                </a>
              </div>
              <p className="text-gray-500 text-xs font-body mt-4">
                © 2025 Mơ Nguyễn Makeup & Studio. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-fade-in">
            <button 
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#8B0000] rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="font-serif-display text-2xl font-bold text-[#2c1810] mb-2">
                Chọn Cách Liên Hệ
              </h3>
              {currentBookingPackage && (
                <p className="text-gray-600 text-sm">
                  Đặt lịch: <span className="font-semibold">{currentBookingPackage}</span>
                </p>
              )}
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => handleContact('zalo')}
                className="w-full flex items-center justify-center space-x-3 bg-blue-500 text-white py-4 px-6 rounded-xl hover:bg-blue-600 transition-colors font-semibold"
              >
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-500 text-sm font-bold">Z</span>
                </div>
                <span>Chat qua Zalo</span>
              </button>
              
              <button 
                onClick={() => handleContact('facebook')}
                className="w-full flex items-center justify-center space-x-3 bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                <Facebook className="w-6 h-6" />
                <span>Nhắn tin Facebook</span>
              </button>
              
              <button 
                onClick={() => handleContact('phone')}
                className="w-full flex items-center justify-center space-x-3 bg-green-500 text-white py-4 px-6 rounded-xl hover:bg-green-600 transition-colors font-semibold"
              >
                <Phone className="w-6 h-6" />
                <span>Gọi điện: 038 309 1515</span>
              </button>
            </div>
            
            <button 
              onClick={() => setShowBookingModal(false)}
              className="w-full mt-4 text-gray-500 hover:text-gray-700 transition-colors py-2"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TetLandingPage;