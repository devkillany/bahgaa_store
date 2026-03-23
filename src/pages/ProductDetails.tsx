import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';
import { ShoppingBag, ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error('المنتج غير موجود');
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `products/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    toast.success('تمت الإضافة إلى السلة!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D88A9A] border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-reqaa text-[#3E2723] mb-4">المنتج غير موجود</h2>
        <Link to="/products" className="text-[#D88A9A] font-almarai font-bold hover:underline">
          العودة للمنتجات
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <nav className="flex items-center gap-2 text-sm md:text-base font-almarai mb-8 text-[#6D4C41] overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-[#D88A9A] transition-colors">الرئيسية</Link>
        <ChevronLeft className="w-4 h-4 text-[#D7CCC8] flex-shrink-0" />
        <Link to="/products" className="hover:text-[#D88A9A] transition-colors">المنتجات</Link>
        <ChevronLeft className="w-4 h-4 text-[#D7CCC8] flex-shrink-0" />
        <span className="text-[#D88A9A] font-bold truncate">{product.title}</span>
      </nav>

      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-[#D7CCC8]/50 flex flex-col lg:flex-row gap-10">
        
        {/* Image Gallery */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F8F6F0] group">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt={`${product.title} - صورة ${currentImageIndex + 1}`}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-[#3E2723] shadow-md transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-[#3E2723] shadow-md transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </>
            )}
            
            {product.isBestSeller && (
              <span className="absolute top-4 right-4 bg-[#D88A9A] text-white text-sm font-bold px-3 py-1.5 rounded-lg font-almarai shadow-sm">
                الأكثر مبيعاً
              </span>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    currentImageIndex === idx ? 'border-[#D88A9A] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-reqaa text-[#3E2723] mb-4"
          >
            {product.title}
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-[#D88A9A] font-almarai mb-8"
          >
            {product.price} ج.م
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-stone max-w-none mb-10 font-almarai text-[#6D4C41] leading-relaxed whitespace-pre-wrap"
          >
            {product.description}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-auto pt-8 border-t border-[#D7CCC8]/50"
          >
            <button 
              onClick={handleAddToCart}
              className="w-full bg-[#6D4C41] hover:bg-[#3E2723] text-white py-4 rounded-xl transition-colors font-almarai font-bold text-lg flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
            >
              <ShoppingBag className="w-6 h-6" />
              أضف إلى السلة
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
