import React from 'react';
import { X, Trash2, Plus, Minus, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, getCartTotal } = useCartStore();

  const total = getCartTotal();

  const handleWhatsAppCheckout = () => {
    const phoneNumber = '201091470625';
    let message = 'مرحباً، أريد طلب المنتجات التالية:%0A%0A';
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.title} - العدد: ${item.quantity} - السعر: ${item.price * item.quantity} ج.م%0A`;
    });
    
    message += `%0Aالإجمالي: ${total} ج.م`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" dir="rtl">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={toggleCart} 
          />
          
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-y-0 left-0 max-w-md w-full flex"
          >
            <div className="w-full h-full bg-[#F8F6F0] shadow-xl flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#D7CCC8]">
                <h2 className="text-2xl font-reqaa text-[#3E2723] font-bold">سلة المشتريات</h2>
                <button onClick={toggleCart} className="p-2 hover:bg-[#D7CCC8]/30 rounded-full transition-colors text-[#3E2723]">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-[#6D4C41] font-almarai">
                    <ShoppingBagIcon className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-lg">السلة فارغة حالياً</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        key={item.id} 
                        className="flex gap-4 bg-white p-3 rounded-xl shadow-sm border border-[#D7CCC8]/50"
                      >
                        <img src={item.imageUrl} alt={item.title} className="w-20 h-20 object-cover rounded-lg" />
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <h3 className="font-almarai font-bold text-[#3E2723] line-clamp-2">{item.title}</h3>
                            <button onClick={() => removeItem(item.id)} className="text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold text-[#D88A9A]">{item.price} ج.م</span>
                            <div className="flex items-center gap-3 bg-[#F8F6F0] rounded-full px-2 py-1 border border-[#D7CCC8]">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-[#6D4C41] hover:text-[#D88A9A]">
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="font-almarai font-bold text-sm w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-[#6D4C41] hover:text-[#D88A9A]">
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-[#D7CCC8] p-4 bg-white">
                  <div className="flex justify-between items-center mb-4 font-almarai font-bold text-lg text-[#3E2723]">
                    <span>الإجمالي:</span>
                    <span className="text-[#D88A9A]">{total} ج.م</span>
                  </div>
                  <button 
                    onClick={handleWhatsAppCheckout}
                    className="w-full py-3 bg-[#6D4C41] hover:bg-[#3E2723] text-white rounded-xl font-almarai font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    إرسال الطلب عبر واتساب
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ShoppingBagIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
