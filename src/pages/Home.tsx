import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';
import { ShoppingBag, ArrowLeft, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const { addItem } = useCartStore();

  useEffect(() => {
    let unsubCategories: () => void;
    let unsubBestSellers: () => void;

    const fetchHomeData = async () => {
      try {
        // Fetch Categories
        const catQuery = query(collection(db, 'categories'), limit(6));
        unsubCategories = onSnapshot(catQuery, (snapshot) => {
          const catData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setCategories(catData);
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, 'categories');
        });

        // Fetch Best Sellers
        const bestQuery = query(collection(db, 'products'), where('isBestSeller', '==', true), limit(4));
        unsubBestSellers = onSnapshot(bestQuery, (snapshot) => {
          const bestData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setBestSellers(bestData);
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, 'products');
        });
      } catch (error) {
        console.error("Error setting up listeners:", error);
      }
    };

    fetchHomeData();

    return () => {
      if (unsubCategories) unsubCategories();
      if (unsubBestSellers) unsubBestSellers();
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-16 md:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#F8F6F0] to-[#D7CCC8]/30 pt-12 pb-24 overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center md:text-right z-10"
          >
            <p className="text-[#D88A9A] font-almarai font-bold mb-2">إصدارات 2026 الحصرية</p>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-reqaa text-[#3E2723] mb-6 leading-tight">
              تفاصيل تُصاغ لتُبهج يومك<br/>
              <span className="text-[#6D4C41]">ولمسات تُعيد تعريف أناقة مساحتك</span>
            </h1>
            <p className="text-lg text-[#6D4C41] font-almarai mb-8 max-w-lg mx-auto md:mx-0">
              مجموعة مُنتقاة بعناية من الأدوات المكتبية والمنظمات، حيث يلتقي الجمال بالوظيفة في تناغمٍ استثنائي، لتتحول مساحتك إلى عالمٍ من الرقي والإلهام، وتصبح كل لحظة عمل انعكاسًا لذوقك الرفيع وإنتاجيتك المتجددة.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <Link to="/products" className="bg-[#3E2723] hover:bg-[#6D4C41] text-[#F8F6F0] px-8 py-4 rounded-full font-almarai font-bold transition-colors flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                تسوق الآن
              </Link>
              <button onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })} className="text-[#3E2723] hover:text-[#D88A9A] font-almarai font-bold flex items-center gap-2 transition-colors">
                اكتشف المزيد
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 relative z-10 mt-12 md:mt-0 w-full"
          >
            <div className="relative w-full max-w-sm md:max-w-md mx-auto">
              <div className="absolute -inset-4 bg-[#D88A9A]/20 rounded-full blur-3xl"></div>
              <motion.img 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                src="https://i.ibb.co/r21t0F0K/1774078937775.jpg" 
                alt="دفاتر ومنظمات" 
                className="relative rounded-[2rem] shadow-2xl border-4 border-white rotate-3 hover:rotate-0 transition-transform duration-500 w-full"
              />
              <motion.img 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                src="https://i.ibb.co/Mk2XP2YX/Scre0.png" 
                alt="صورة إضافية 1" 
                className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-xl"
              />
              <motion.img 
                animate={{ rotate: [-12, -5, -12] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                src="https://i.ibb.co/MySnCYqX/image.png" 
                alt="صورة إضافية 2" 
                className="absolute -top-4 -right-4 md:-top-8 md:-right-8 w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-4 border-white shadow-xl -rotate-12"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-reqaa text-[#3E2723] mb-4">تصفح حسب القسم</h2>
          <div className="w-24 h-1 bg-[#D88A9A] mx-auto rounded-full"></div>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.length > 0 ? categories.map((cat) => {
            const fallbackImages: Record<string, string> = {
              'دفاتر': 'https://i.ibb.co/gZXFF6Mr/5904253720789191590.jpg',
              'أقلام': 'https://i.ibb.co/LdGfTdFM/5803066202552126054.jpg',
              'منظمات': 'https://i.ibb.co/mj2rZXc/5774005848240753547.jpg',
              'بوكسات': 'https://i.ibb.co/Wvxkv2k0/5983492878103153579.jpg',
              'مجات': 'https://i.ibb.co/GQ9cSd8K/5861889980148862814.jpg',
              'هدايا وبوكسات': 'https://i.ibb.co/KzB7gvJ9/5852901704523779451.jpg',
            };
            const imgUrl = cat.imageUrl || fallbackImages[cat.name] || 'https://i.ibb.co/gZXFF6Mr/5904253720789191590.jpg';
            
            return (
              <motion.div key={cat.id} variants={itemVariants}>
                <Link to={`/products?category=${cat.slug}`} className="group relative overflow-hidden rounded-2xl aspect-[4/3] shadow-md block">
                  <img src={imgUrl} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                    <h3 className="text-white font-reqaa text-3xl drop-shadow-md">{cat.name}</h3>
                  </div>
                </Link>
              </motion.div>
            );
          }) : (
            // Fallback categories if none in DB
            [
              { name: 'دفاتر', img: 'https://i.ibb.co/gZXFF6Mr/5904253720789191590.jpg', slug: 'notebooks' },
              { name: 'أقلام', img: 'https://i.ibb.co/LdGfTdFM/5803066202552126054.jpg', slug: 'pens' },
              { name: 'منظمات', img: 'https://i.ibb.co/mj2rZXc/5774005848240753547.jpg', slug: 'organizers' },
              { name: 'بوكسات', img: 'https://i.ibb.co/Wvxkv2k0/5983492878103153579.jpg', slug: 'boxes' },
              { name: 'مجات', img: 'https://i.ibb.co/GQ9cSd8K/5861889980148862814.jpg', slug: 'mugs' },
            ].map((cat, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Link to={`/products?category=${cat.slug}`} className="group relative overflow-hidden rounded-2xl aspect-[4/3] shadow-md block">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                    <h3 className="text-white font-reqaa text-3xl drop-shadow-md">{cat.name}</h3>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
      </section>

      {/* Best Sellers */}
      <section className="bg-[#D7CCC8]/20 py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-reqaa text-[#3E2723] mb-4">الأكثر مبيعاً</h2>
            <div className="w-24 h-1 bg-[#D88A9A] mx-auto rounded-full"></div>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {bestSellers.map((product) => (
              <motion.div key={product.id} variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-[#D7CCC8]/50 flex flex-col group">
                <Link to={`/products/${product.id}`} className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-[#F8F6F0] block">
                  <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </Link>
                <div className="flex-1 flex flex-col">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="font-almarai font-bold text-lg text-[#3E2723] mb-2 line-clamp-1 hover:text-[#D88A9A] transition-colors">{product.title}</h3>
                  </Link>
                  <p className="text-[#6D4C41] text-sm mb-4 line-clamp-2 font-almarai">{product.description}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-xl text-[#D88A9A]">{product.price} ج.م</span>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      className="bg-[#6D4C41] hover:bg-[#3E2723] text-white p-2 rounded-lg transition-colors"
                    >
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-[#6D4C41] py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="flex-1 text-right"
            >
              <div className="inline-block bg-[#D88A9A]/20 text-[#F8F6F0] px-4 py-1 rounded-full text-sm font-bold mb-6 font-almarai">
                قصة "بهجة"
              </div>
              <h2 className="text-4xl md:text-6xl font-reqaa text-[#F8F6F0] mb-8 leading-tight">
                حيث تبدأ التفاصيل الصغيرة…<br />
                <span className="text-[#D88A9A]">بصناعة المعنى الكبير</span>
              </h2>
              
              <div className="space-y-6 text-[#D7CCC8] font-almarai text-lg leading-relaxed">
                <p>
                  وُلدت "بهجة" من شغفٍ صادق بالورق والقلم، ومن إيمانٍ عميق بأن ترتيب مساحتك ليس مجرد رفاهية، بل هو بداية ترتيب أفكارك وصياغة عالمك الداخلي. نحن لا نقدّم أدوات مكتبية فحسب، بل نصنع رفقاء يوميين يلهمونك، ويحوّلون فوضى اللحظات إلى تناغمٍ جميل، كأنها لوحة تُرسم بهدوء وإتقان.
                </p>
                <p className="text-[#F8F6F0] font-bold text-xl border-r-4 border-[#D88A9A] pr-4 py-2">
                  نمنحك تجربة تتجاوز الاستخدام، لتلامس الإحساس…<br />
                  حيث كل تفصيلة صُممت لتُشبهك، وتُعبّر عنك.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-[#F8F6F0]/10">
                <div>
                  <div className="text-3xl font-reqaa text-[#D88A9A] mb-2">100%</div>
                  <div className="text-[#F8F6F0] font-bold mb-1">خامات صديقة للبيئة</div>
                  <div className="text-[#D7CCC8] text-sm">لأن الجمال الحقيقي لا يضر</div>
                </div>
                <div>
                  <div className="text-3xl font-reqaa text-[#D88A9A] mb-2">صُنع بحب</div>
                  <div className="text-[#F8F6F0] font-bold mb-1">تفاصيل متقنة</div>
                  <div className="text-[#D7CCC8] text-sm">لأن التفاصيل تُصنع بالشغف</div>
                </div>
                <div>
                  <div className="text-3xl font-reqaa text-[#D88A9A] mb-2">تصاميم عربية</div>
                  <div className="text-[#F8F6F0] font-bold mb-1">فريدة وأصيلة</div>
                  <div className="text-[#D7CCC8] text-sm">تعكس هويتك بروحٍ عصرية راقية</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex-1 relative mt-12 lg:mt-0 w-full"
            >
              <div className="relative w-full max-w-sm md:max-w-lg mx-auto">
                <img 
                  src="https://i.ibb.co/wF0Ntx4J/image.png" 
                  alt="أدوات مكتبية" 
                  className="relative w-full aspect-[4/3] object-cover rounded-3xl border-8 border-[#F8F6F0] shadow-xl"
                />
                <img 
                  src="https://i.ibb.co/RkCSCGJB/image.png" 
                  alt="تفاصيل" 
                  className="absolute -bottom-8 -right-4 md:-bottom-12 md:-right-8 w-2/5 aspect-[3/4] object-cover rounded-2xl border-4 md:border-8 border-[#F8F6F0] shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="bg-gradient-to-r from-[#D7CCC8] via-[#E4D7CE] to-[#D7CCC8] rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-12 relative overflow-hidden shadow-lg border border-white/40"
        >
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
          
          {/* Elegant decorative elements */}
          <div className="absolute -top-10 right-[20%] w-[2px] h-64 bg-gradient-to-b from-[#6D4C41]/0 via-[#6D4C41]/15 to-[#6D4C41]/0 transform rotate-[35deg]"></div>
          <div className="absolute -bottom-10 left-[20%] w-[2px] h-64 bg-gradient-to-t from-[#6D4C41]/0 via-[#6D4C41]/15 to-[#6D4C41]/0 transform rotate-[35deg]"></div>
          
          {/* Floating particles */}
          <div className="absolute top-1/4 right-1/3 w-1.5 h-1.5 rounded-full bg-[#6D4C41]/20"></div>
          <div className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full bg-[#6D4C41]/15"></div>
          <div className="absolute top-1/2 left-12 w-1 h-1 rounded-full bg-[#6D4C41]/25"></div>
          <div className="absolute bottom-1/4 right-16 w-1.5 h-1.5 rounded-full bg-[#6D4C41]/20"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="relative bg-[#F8F6F0]/50 backdrop-blur-md rounded-2xl md:rounded-3xl p-6 md:p-16 text-center shadow-[0_8px_32px_rgba(62,39,35,0.05)] border border-white/60">
              {/* Decorative corner accents */}
              <div className="absolute top-4 right-4 md:top-6 md:right-6 w-6 h-6 md:w-10 md:h-10 border-t-[1.5px] border-r-[1.5px] border-[#6D4C41]/30 rounded-tr-xl md:rounded-tr-2xl"></div>
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 w-6 h-6 md:w-10 md:h-10 border-b-[1.5px] border-l-[1.5px] border-[#6D4C41]/30 rounded-bl-xl md:rounded-bl-2xl"></div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-reqaa text-[#3E2723] leading-[1.6] md:leading-[1.8] mb-6 md:mb-8">
                "الكتابة هي الطريقة التي نكتشف بها ما نفكر فيه حقًا."
              </h2>
              <div className="flex items-center justify-center gap-6">
                <div className="h-[1px] w-16 bg-gradient-to-l from-[#6D4C41]/40 to-transparent"></div>
                <p className="text-[#6D4C41] font-almarai text-lg md:text-xl font-bold tracking-wide">
                  ديفيد مكاللوف
                </p>
                <div className="h-[1px] w-16 bg-gradient-to-r from-[#6D4C41]/40 to-transparent"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-[#F8F6F0] overflow-hidden">
        <div className="container mx-auto px-4 mb-16 text-center">
          <div className="inline-block text-[#D7CCC8] text-sm font-bold mb-2 font-almarai tracking-wider">
            مجتمع أشياء
          </div>
          <h2 className="text-4xl md:text-5xl font-reqaa text-[#3E2723] mb-4 flex items-center justify-center gap-3">
            من آراء عملائنا <span className="text-3xl">✨</span>
          </h2>
          <p className="text-[#6D4C41] font-almarai text-lg">
            نعتز بكل لحظة إبداع تشاركونا إياها
          </p>
        </div>

        {/* Scrolling Images */}
        <div className="relative w-full overflow-hidden pb-12">
          {/* Gradient masks for smooth scrolling edges */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-[#F8F6F0] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-[#F8F6F0] to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex gap-6 px-4 md:px-24 overflow-x-auto pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[
              "https://i.ibb.co/ycNBM6QH/1.png",
              "https://i.ibb.co/vCGxyxzZ/2.jpg",
              "https://i.ibb.co/Gf9JCvfF/3.jpg",
              "https://i.ibb.co/wh1Np4PG/4.jpg",
              "https://i.ibb.co/pSVQF0w/5.jpg",
              "https://i.ibb.co/hFWD0NS1/6.jpg",
              "https://i.ibb.co/p9YVcVC/7.jpg",
              "https://i.ibb.co/v6cL0wvY/8.jpg",
              "https://i.ibb.co/BSc7Pxd/9.jpg",
              "https://i.ibb.co/QFnttD3C/11.jpg",
              "https://i.ibb.co/2YvZwVt1/12.jpg",
              "https://i.ibb.co/39LjsdcW/13.jpg",
              "https://i.ibb.co/TMLv8j8r/14.jpg",
              "https://i.ibb.co/YFqS0fXC/19.jpg",
              "https://i.ibb.co/TBD4f2tw/20.jpg",
              "https://i.ibb.co/6cKf1kWr/21.jpg",
              "https://i.ibb.co/TDNq0Yr9/22.jpg",
              "https://i.ibb.co/dsF7fjCP/24.jpg",
              "https://i.ibb.co/wFHthsKs/25.jpg"
            ].map((imgUrl, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (index % 5) * 0.1 }}
                className={`flex-none w-64 md:w-72 snap-center transform ${index % 2 === 0 ? 'rotate-2' : '-rotate-2'} hover:rotate-0 hover:scale-105 hover:z-20 transition-all duration-300`}
              >
                <div className="bg-white p-3 pb-12 rounded-sm shadow-xl border border-gray-100 relative">
                  <div className="aspect-[3/4] overflow-hidden rounded-sm bg-[#F8F6F0]">
                    <img 
                      src={imgUrl} 
                      alt={`رأي العميل ${index + 1}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if ibb.co viewer link fails to load as image
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/review${index}/400/600`;
                      }}
                    />
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 text-center text-[#6D4C41]/60 font-almarai text-sm">
                    @bahgaa.storee
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <a 
            href="https://www.instagram.com/bahgaa.storee" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-3 bg-[#3E2723] hover:bg-[#6D4C41] text-[#F8F6F0] px-8 py-4 rounded-full font-almarai font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Instagram className="w-6 h-6" />
            شاركنا قصتك على انستجرام
          </a>
        </div>
      </section>
    </div>
  );
}
