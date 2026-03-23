import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Link, useSearchParams } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';
import { ShoppingBag, Filter, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  
  const { addItem } = useCartStore();
  const currentCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    let unsubCategories: () => void;
    let unsubProducts: () => void;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Categories
        const catQuery = query(collection(db, 'categories'), orderBy('name'));
        unsubCategories = onSnapshot(catQuery, (snapshot) => {
          const catData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setCategories(catData);
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, 'categories');
        });

        // Fetch Products
        const prodQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        unsubProducts = onSnapshot(prodQuery, (snapshot) => {
          const prodData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setProducts(prodData);
          setLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, 'products');
          setLoading(false);
        });
      } catch (error) {
        console.error("Error setting up listeners:", error);
        toast.error('حدث خطأ أثناء تحميل المنتجات');
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (unsubCategories) unsubCategories();
      if (unsubProducts) unsubProducts();
    };
  }, []);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    toast.success('تمت الإضافة إلى السلة!');
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMinPrice = minPrice === '' || product.price >= Number(minPrice);
    const matchesMaxPrice = maxPrice === '' || product.price <= Number(maxPrice);
    
    return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <motion.h1 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-reqaa text-[#3E2723]"
        >
          منتجاتنا
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-auto flex flex-col sm:flex-row gap-4 items-center"
        >
          {(minPrice !== '' || maxPrice !== '' || searchTerm !== '' || currentCategory !== 'all') && (
            <button
              onClick={() => {
                setMinPrice('');
                setMaxPrice('');
                setSearchTerm('');
                setSearchParams({});
              }}
              className="text-xs text-[#D88A9A] hover:text-[#3E2723] font-almarai font-bold transition-colors whitespace-nowrap"
            >
              مسح الفلاتر
            </button>
          )}
          <div className="flex items-center gap-2 bg-white rounded-full border border-[#D7CCC8] px-4 py-1.5 shadow-sm focus-within:border-[#D88A9A] focus-within:ring-1 focus-within:ring-[#D88A9A] transition-all w-full sm:w-auto justify-center">
            <span className="text-sm text-[#6D4C41] font-almarai font-bold whitespace-nowrap">السعر:</span>
            <input 
              type="number" 
              placeholder="من" 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
              className="w-16 sm:w-20 px-1 py-1 focus:outline-none font-almarai bg-transparent text-sm text-center text-[#3E2723] placeholder:text-[#D7CCC8]"
              min="0"
            />
            <span className="text-[#D7CCC8] font-bold">-</span>
            <input 
              type="number" 
              placeholder="إلى" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
              className="w-16 sm:w-20 px-1 py-1 focus:outline-none font-almarai bg-transparent text-sm text-center text-[#3E2723] placeholder:text-[#D7CCC8]"
              min="0"
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <input 
              type="text" 
              placeholder="ابحث عن منتج..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-4 pr-11 py-2 rounded-full border border-[#D7CCC8] focus:outline-none focus:border-[#D88A9A] focus:ring-1 focus:ring-[#D88A9A] font-almarai bg-white transition-all shadow-sm text-[#3E2723] placeholder:text-[#D7CCC8]"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D88A9A] w-5 h-5" />
          </div>
        </motion.div>
      </div>

      {/* Categories Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-3 mb-10 pb-4 overflow-x-auto hide-scrollbar"
      >
        <button
          onClick={() => setSearchParams({})}
          className={`px-6 py-2 rounded-full font-almarai font-bold whitespace-nowrap transition-colors relative ${
            currentCategory === 'all' 
              ? 'text-white' 
              : 'bg-white text-[#6D4C41] border border-[#D7CCC8] hover:bg-[#F8F6F0]'
          }`}
        >
          {currentCategory === 'all' && (
            <motion.div layoutId="activeCategory" className="absolute inset-0 bg-[#6D4C41] rounded-full -z-10" />
          )}
          الكل
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSearchParams({ category: cat.slug })}
            className={`px-6 py-2 rounded-full font-almarai font-bold whitespace-nowrap transition-colors relative ${
              currentCategory === cat.slug 
                ? 'text-white' 
                : 'bg-white text-[#6D4C41] border border-[#D7CCC8] hover:bg-[#F8F6F0]'
            }`}
          >
            {currentCategory === cat.slug && (
              <motion.div layoutId="activeCategory" className="absolute inset-0 bg-[#6D4C41] rounded-full -z-10" />
            )}
            {cat.name}
          </button>
        ))}
      </motion.div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D88A9A] border-t-transparent"></div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div 
                key={product.id} 
                variants={itemVariants}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-[#D7CCC8]/50 flex flex-col group"
              >
                <Link to={`/products/${product.id}`} className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-[#F8F6F0] block">
                  <img 
                    src={product.imageUrl} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  {product.isBestSeller && (
                    <span className="absolute top-2 right-2 bg-[#D88A9A] text-white text-xs font-bold px-2 py-1 rounded-md font-almarai">
                      الأكثر مبيعاً
                    </span>
                  )}
                </Link>
                <div className="flex-1 flex flex-col">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-almarai font-bold text-lg text-[#3E2723] mb-2 hover:text-[#D88A9A] transition-colors">{product.title}</h3>
                  </Link>
                  <p className="text-[#6D4C41] text-sm mb-4 line-clamp-2 font-almarai flex-1">{product.description}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-xl text-[#D88A9A]">{product.price} ج.م</span>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      className="bg-[#6D4C41] hover:bg-[#3E2723] text-white px-4 py-2 rounded-lg transition-colors font-almarai font-bold flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      أضف للسلة
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-white rounded-3xl border border-[#D7CCC8]/50"
        >
          <Filter className="w-16 h-16 text-[#D7CCC8] mx-auto mb-4" />
          <h3 className="text-2xl font-reqaa text-[#3E2723] mb-2">لا توجد منتجات</h3>
          <p className="text-[#6D4C41] font-almarai">لم نتمكن من العثور على منتجات تطابق بحثك حالياً.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSearchParams({}); }}
            className="mt-6 text-[#D88A9A] font-almarai font-bold hover:underline"
          >
            عرض كل المنتجات
          </button>
        </motion.div>
      )}
    </div>
  );
}
