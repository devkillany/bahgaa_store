import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { ShoppingBag, Menu, X, Instagram, Facebook, Send, LogIn, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCartStore } from './store/cartStore';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import CartDrawer from './components/CartDrawer';
import ScrollToTop from './components/ScrollToTop';

function Layout() {
  const { items, toggleCart } = useCartStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F0] text-[#3E2723] font-alexandria overflow-x-hidden" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-[#F8F6F0]/90 backdrop-blur-md border-b border-[#D7CCC8]">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="https://i.ibb.co/VWvcGnRB/logo.jpg" alt="بهجة ستور" className="h-12 w-12 rounded-full object-cover" />
            <span className="font-reqaa text-2xl font-bold text-[#D88A9A]">بهجة ستور</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-almarai font-semibold">
            <Link to="/" className="hover:text-[#D88A9A] transition-colors">الرئيسية</Link>
            <Link to="/products" className="hover:text-[#D88A9A] transition-colors">المنتجات</Link>
            <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#D88A9A] transition-colors">تواصل معنا</button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button onClick={toggleCart} className="relative p-2 hover:bg-[#D7CCC8]/30 rounded-full transition-colors">
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#D88A9A] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
            
            <button 
              className="md:hidden p-2 hover:bg-[#D7CCC8]/30 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden absolute top-20 left-0 w-full bg-[#F8F6F0] border-b border-[#D7CCC8] shadow-lg overflow-hidden z-40"
            >
              <nav className="flex flex-col p-4 font-almarai font-semibold gap-4">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D88A9A] transition-colors">الرئيسية</Link>
                <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D88A9A] transition-colors">المنتجات</Link>
                <button onClick={() => { setIsMobileMenuOpen(false); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-right hover:text-[#D88A9A] transition-colors">تواصل معنا</button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-grow relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={useLocation().pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-[#3E2723] text-[#F8F6F0] py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <img src="https://i.ibb.co/VWvcGnRB/logo.jpg" alt="بهجة ستور" className="h-10 w-10 rounded-full object-cover" />
              <span className="font-reqaa text-2xl font-bold text-[#D88A9A]">بهجة ستور</span>
            </div>
            <p className="text-[#D7CCC8] mb-6 font-almarai">
              متجركم المفضل لجميع الأدوات المكتبية التي تلهم الإبداع وتجمل تفاصيل يومك.
            </p>
          </div>
          
          <div>
            <h3 className="font-almarai font-bold text-xl mb-4 text-[#D88A9A]">روابط سريعة</h3>
            <ul className="space-y-2 text-[#D7CCC8]">
              <li><Link to="/" className="hover:text-white transition-colors">الرئيسية</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">المنتجات</Link></li>
              <li><button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">تواصل معنا</button></li>
            </ul>
          </div>

          <div>
            <h3 className="font-almarai font-bold text-xl mb-4 text-[#D88A9A]">تابعنا</h3>
            <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
              <a href="https://www.instagram.com/bahgaa.storee" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#D88A9A] flex items-center justify-center hover:bg-[#C07080] transition-colors">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="https://www.facebook.com/1050414071496553" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#D88A9A] flex items-center justify-center hover:bg-[#C07080] transition-colors">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href="https://t.me/bahgaastoree" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#D88A9A] flex items-center justify-center hover:bg-[#C07080] transition-colors">
                <Send className="w-5 h-5 text-white" />
              </a>
            </div>
            <div className="text-[#D7CCC8]">
              <p>للتواصل عبر الواتساب:</p>
              <a href="https://wa.me/201091470625" target="_blank" rel="noreferrer" className="text-[#D88A9A] hover:text-white font-bold text-lg" dir="ltr">+20 109 147 0625</a>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-[#6D4C41] text-center text-[#D7CCC8] flex flex-col items-center gap-2">
          <p>© {new Date().getFullYear()} بهجة ستور. كل الحقوق محفوظة.</p>
          <p className="text-sm">
            تم التطوير بواسطة: <a href="https://devkillany.github.io/portofolio3/" target="_blank" rel="noreferrer" className="text-[#D88A9A] hover:underline font-bold">المطور. محمد الكيلاني</a>
          </p>
        </div>
      </footer>

      <CartDrawer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'var(--font-almarai)', direction: 'rtl' } }} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}
