import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Headphones, Keyboard, PenTool, Zap, PlayCircle, Sparkles, Music, ListChecks, ToggleRight, Star, Volume2, Flame, Heart, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSession } from '@/cantonese/components/providers/SessionContextProvider'
import { useProfile } from '@/cantonese/components/providers/ProfileProvider'

export default function Index(){ return <HongKongRetroLanding/> }

function HongKongRetroLanding() {
  const { session, isLoading: isSessionLoading } = useSession();
  const { isAdmin, isLoadingProfile } = useProfile();

  if (isSessionLoading || isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-cyan-400 text-2xl font-bold animate-pulse" style={{textShadow: '0 0 20px rgba(0,240,255,0.8)'}}>
          載入中...
        </div>
      </div>
    );
  }

  return (
    <main className="relative bg-black text-white overflow-hidden">
      {/* Retro film grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        backgroundRepeat: 'repeat'
      }} />

      {/* Scanlines for CRT effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
        backgroundSize: '100% 2px'
      }} />

      {/* Background glow effect */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,16,240,0.15)_0%,_rgba(0,0,0,1)_50%)]" />

      <Hero />
      <MarketSection />
      <NeonSignsShowcase />
      <CantoneseFeaturesIntro />
      <TestimonialsStrip />
      <Footer />
    </main>
  )
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Hong Kong skyline silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-64 opacity-20">
        <svg viewBox="0 0 1200 300" className="w-full h-full" preserveAspectRatio="none">
          <rect x="50" y="150" width="80" height="150" fill="url(#grad1)" />
          <rect x="150" y="100" width="60" height="200" fill="url(#grad2)" />
          <rect x="230" y="130" width="70" height="170" fill="url(#grad1)" />
          <rect x="320" y="80" width="90" height="220" fill="url(#grad3)" />
          <rect x="430" y="120" width="65" height="180" fill="url(#grad2)" />
          <rect x="520" y="90" width="85" height="210" fill="url(#grad1)" />
          <rect x="625" y="110" width="75" height="190" fill="url(#grad3)" />
          <rect x="720" y="140" width="60" height="160" fill="url(#grad2)" />
          <rect x="800" y="100" width="80" height="200" fill="url(#grad1)" />
          <rect x="900" y="120" width="70" height="180" fill="url(#grad3)" />
          <rect x="990" y="90" width="90" height="210" fill="url(#grad2)" />
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor:'#FF10F0',stopOpacity:0.6}} />
              <stop offset="100%" style={{stopColor:'#00F0FF',stopOpacity:0.3}} />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor:'#00F0FF',stopOpacity:0.6}} />
              <stop offset="100%" style={{stopColor:'#FFD700',stopOpacity:0.3}} />
            </linearGradient>
            <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor:'#FF6B35',stopOpacity:0.6}} />
              <stop offset="100%" style={{stopColor:'#FF10F0',stopOpacity:0.3}} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">

          {/* Main neon sign */}
          <motion.div
            initial={{opacity:0, y:30}}
            animate={{opacity:1, y:0}}
            transition={{duration:0.8}}
            className="mb-12"
          >
            <div className="inline-block relative">
              {/* Top line - Chinese characters */}
              <h1
                className="text-7xl md:text-9xl font-black mb-4"
                style={{
                  color: '#FF10F0',
                  textShadow: `
                    0 0 10px rgba(255,16,240,1),
                    0 0 20px rgba(255,16,240,0.8),
                    0 0 30px rgba(255,16,240,0.6),
                    0 0 40px rgba(255,16,240,0.4),
                    0 0 70px rgba(255,16,240,0.2)
                  `,
                  WebkitTextStroke: '2px rgba(255,16,240,0.5)'
                }}
              >
                粵語學堂
              </h1>

              {/* Glow effect behind */}
              <div
                className="absolute inset-0 blur-3xl opacity-60 -z-10"
                style={{background: 'radial-gradient(ellipse, rgba(255,16,240,0.6) 0%, transparent 70%)'}}
              />
            </div>

            {/* Subtitle - Vietnamese with neon */}
            <h2
              className="text-4xl md:text-6xl font-bold mt-6"
              style={{
                color: '#00F0FF',
                textShadow: `
                  0 0 10px rgba(0,240,255,0.9),
                  0 0 20px rgba(0,240,255,0.6),
                  0 0 30px rgba(0,240,255,0.3)
                `,
                letterSpacing: '0.1em'
              }}
            >
              HỌC TIẾNG QUẢNG - HƯƠNG VỊ HỒNG KÔNG
            </h2>

            {/* Third line - Fusion tagline */}
            <p
              className="text-2xl md:text-3xl font-semibold mt-4"
              style={{
                color: '#FFD700',
                textShadow: '0 0 15px rgba(255,215,0,0.8)',
                letterSpacing: '0.05em'
              }}
            >
              九龍 × Chợ Lớn • 學粵語 • Ăn Dimsum 🥟
            </p>
          </motion.div>

          {/* CTA Buttons with neon style */}
          <motion.div
            initial={{opacity:0, y:20}}
            animate={{opacity:1, y:0}}
            transition={{duration:0.6, delay:0.3}}
            className="flex flex-wrap justify-center gap-6 mt-12"
          >
            <Link to="/cantonese/lessons">
              <button
                className="group relative px-10 py-5 text-xl font-black rounded-xl overflow-hidden border-4 transition-all hover:scale-105 active:scale-95"
                style={{
                  borderColor: '#FF10F0',
                  background: 'linear-gradient(135deg, rgba(255,16,240,0.3) 0%, rgba(138,43,226,0.3) 100%)',
                  boxShadow: '0 0 30px rgba(255,16,240,0.5), inset 0 0 20px rgba(255,16,240,0.2)',
                  color: 'white'
                }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Zap className="h-6 w-6" style={{filter: 'drop-shadow(0 0 8px rgba(255,215,0,1))'}} />
                  VÀO HỌC NGAY
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </Link>

            <Link to="/cantonese/songs">
              <button
                className="group relative px-10 py-5 text-xl font-black rounded-xl overflow-hidden border-4 transition-all hover:scale-105 active:scale-95"
                style={{
                  borderColor: '#FF6B35',
                  background: 'linear-gradient(135deg, rgba(255,107,53,0.3) 0%, rgba(247,147,251,0.3) 100%)',
                  boxShadow: '0 0 30px rgba(255,107,53,0.5), inset 0 0 20px rgba(255,107,53,0.2)',
                  color: 'white'
                }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Music className="h-6 w-6" style={{filter: 'drop-shadow(0 0 8px rgba(255,215,0,1))'}} />
                  HỌC QUA BÀI HÁT
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </Link>
          </motion.div>

          {/* Tone badges with neon glow */}
          <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
            transition={{duration:0.6, delay:0.5}}
            className="flex flex-wrap justify-center gap-3 mt-12"
          >
            <span className="text-gray-400 text-sm font-bold">6 ÂM ĐIỆU:</span>
            {[1,2,3,4,5,6].map(tone => (
              <ToneBadge key={tone} tone={tone} label={`Âm ${tone}`} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function MarketSection() {
  const items = [
    { icon: ShoppingBag, title: '茶樓', subtitle: 'Nhà hàng Dimsum', desc: 'Học từ vựng qua menu ẩm thực Hong Kong thực tế', color: '#FF6B35', emoji: '🥟' },
    { icon: Flame, title: '夜市', subtitle: 'Chợ đêm Temple Street', desc: 'Luyện hội thoại mua bán như ở chợ Cửu Long', color: '#FFD700', emoji: '🏮' },
    { icon: Heart, title: 'TVB劇', subtitle: 'Phim TVB', desc: 'Học tiếng lóng và cách nói của người Hong Kong', color: '#FF10F0', emoji: '📺' },
    { icon: Music, title: 'Cantopop', subtitle: 'Nhạc Quảng Đông', desc: 'Thuộc lòng bài hát của Beyond, Leslie Cheung', color: '#00F0FF', emoji: '🎤' }
  ]

  return (
    <section className="relative py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Section title with bilingual neon */}
        <div className="text-center mb-16">
          <h2
            className="text-5xl md:text-6xl font-black mb-4"
            style={{
              color: '#FFD700',
              textShadow: '0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.4)',
              WebkitTextStroke: '1px rgba(255,215,0,0.5)'
            }}
          >
            香港文化 × ĂN UỐNG SỐNG
          </h2>
          <p className="text-xl text-gray-300">Học tiếng Quảng qua văn hóa đường phố</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: i * 0.1}}
              viewport={{once: true}}
              className="group relative"
            >
              {/* Neon border signboard */}
              <div
                className="relative rounded-2xl p-6 backdrop-blur-md border-4 transition-all hover:scale-105"
                style={{
                  background: 'rgba(0,0,0,0.7)',
                  borderColor: item.color,
                  boxShadow: `0 0 20px ${item.color}80, inset 0 0 20px ${item.color}20`
                }}
              >
                {/* Glow effect */}
                <div
                  className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-50 blur-xl transition-opacity -z-10"
                  style={{background: item.color}}
                />

                {/* Icon with emoji */}
                <div className="flex items-center justify-between mb-4">
                  <item.icon className="h-10 w-10" style={{color: item.color, filter: `drop-shadow(0 0 8px ${item.color})`}} />
                  <span className="text-4xl">{item.emoji}</span>
                </div>

                {/* Chinese title */}
                <h3
                  className="text-3xl font-black mb-1"
                  style={{
                    color: item.color,
                    textShadow: `0 0 10px ${item.color}`,
                    fontFamily: 'serif'
                  }}
                >
                  {item.title}
                </h3>

                {/* Vietnamese subtitle */}
                <p className="text-white font-bold text-lg mb-3">{item.subtitle}</p>

                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>

                {/* Decorative line */}
                <div
                  className="mt-4 h-1 w-full rounded"
                  style={{
                    background: `linear-gradient(90deg, ${item.color} 0%, transparent 100%)`,
                    boxShadow: `0 0 10px ${item.color}`
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function NeonSignsShowcase() {
  const exercises = [
    { icon: BookOpen, title: 'Flashcard', subtitle: '認字卡', desc: 'Học từ vựng lật thẻ, có hình ảnh và audio chuẩn HK', gradient: 'from-purple-600 to-pink-600' },
    { icon: Keyboard, title: 'Điền chỗ trống', subtitle: '填空', desc: 'Luyện ngữ pháp qua các tình huống thực tế', gradient: 'from-cyan-600 to-blue-600' },
    { icon: ListChecks, title: 'Trắc nghiệm', subtitle: '選擇題', desc: 'Kiểm tra nhanh kiến thức qua câu hỏi đa dạng', gradient: 'from-orange-600 to-red-600' },
    { icon: ToggleRight, title: 'Đúng/Sai', subtitle: '對錯', desc: 'Rèn khả năng phán đoán và đọc hiểu nhanh', gradient: 'from-green-600 to-teal-600' },
    { icon: Keyboard, title: 'Sắp xếp câu', subtitle: '排句', desc: 'Nắm vững cấu trúc câu tiếng Quảng Đông', gradient: 'from-yellow-600 to-orange-600' },
    { icon: PenTool, title: 'Viết chữ Hán', subtitle: '寫字', desc: 'Luyện thứ tự nét viết chữ Hán truyền thống', gradient: 'from-red-600 to-pink-600' }
  ]

  return (
    <section className="relative py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Title */}
        <div className="text-center mb-16">
          <h2
            className="text-5xl md:text-6xl font-black mb-4"
            style={{
              color: '#00F0FF',
              textShadow: '0 0 20px rgba(0,240,255,0.9), 0 0 40px rgba(0,240,255,0.5)',
              WebkitTextStroke: '1px rgba(0,240,255,0.5)'
            }}
          >
            練習種類 • BÀI TẬP ĐA DẠNG
          </h2>
        </div>

        {/* Exercise cards as neon signs */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exercises.map((ex, i) => (
            <motion.div
              key={i}
              initial={{opacity: 0, scale: 0.9}}
              whileInView={{opacity: 1, scale: 1}}
              transition={{duration: 0.4, delay: i * 0.08}}
              viewport={{once: true}}
              className="group relative"
            >
              <div className={`relative rounded-2xl p-6 bg-gradient-to-br ${ex.gradient} border-4 border-white/20 overflow-hidden transition-all hover:scale-105 hover:border-white/40`}
                style={{boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 30px rgba(255,255,255,0.1)'}}
              >
                {/* Inner glow */}
                <div className="absolute inset-0 bg-black/30" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <ex.icon
                      className="h-12 w-12 text-white"
                      style={{filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))'}}
                    />
                    <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" style={{filter: 'drop-shadow(0 0 8px rgba(255,215,0,1))'}} />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-black text-white mb-1" style={{textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>
                    {ex.title}
                  </h3>

                  {/* Chinese subtitle */}
                  <p className="text-3xl font-black mb-3" style={{
                    color: '#FFD700',
                    textShadow: '0 0 15px rgba(255,215,0,0.9), 0 2px 5px rgba(0,0,0,0.5)',
                    fontFamily: 'serif'
                  }}>
                    {ex.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-white/90 text-sm leading-relaxed">{ex.desc}</p>
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-100%] group-hover:translate-x-[100%] duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CantoneseFeaturesIntro() {
  return (
    <section className="relative py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Text content */}
          <motion.div
            initial={{opacity: 0, x: -50}}
            whileInView={{opacity: 1, x: 0}}
            transition={{duration: 0.6}}
            viewport={{once: true}}
          >
            <h2
              className="text-4xl md:text-5xl font-black mb-6"
              style={{
                color: '#FF10F0',
                textShadow: '0 0 20px rgba(255,16,240,0.8)',
                WebkitTextStroke: '1px rgba(255,16,240,0.5)'
              }}
            >
              粵語之美 • TIẾNG QUẢNG ĐÔNG
            </h2>

            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p className="text-lg">
                Tiếng Quảng Đông không chỉ là ngôn ngữ, mà là <span className="text-cyan-400 font-bold">nhịp thở của một nền văn hóa</span>.
              </p>
              <p>
                Với <span className="text-yellow-400 font-bold">6 âm điệu</span> phức tạp và giàu sắc thái, nó mang theo chiều sâu lịch sử từ thời Hán cổ đến đời sống hiện đại của Hong Kong.
              </p>
              <p>
                Người Quảng nói nhanh, sắc – nhưng nếu lắng nghe kỹ, bạn sẽ cảm nhận được <span className="text-pink-400 font-bold">sự tinh tế trong từng âm tiết</span>.
              </p>
              <p className="text-xl font-bold text-white">
                Hiểu một ngôn ngữ là chạm vào linh hồn của một cộng đồng. 🏮
              </p>
            </div>

            {/* Tone badges */}
            <div className="flex flex-wrap gap-3 mt-8">
              {[1,2,3,4,5,6].map(tone => (
                <ToneBadge key={tone} tone={tone} label={`Âm ${tone}`} />
              ))}
            </div>
          </motion.div>

          {/* Right: Visual showcase */}
          <motion.div
            initial={{opacity: 0, scale: 0.9}}
            whileInView={{opacity: 1, scale: 1}}
            transition={{duration: 0.6}}
            viewport={{once: true}}
            className="relative"
          >
            <div
              className="rounded-3xl p-8 border-4 backdrop-blur-md"
              style={{
                background: 'linear-gradient(135deg, rgba(255,107,53,0.2) 0%, rgba(240,147,251,0.2) 100%)',
                borderColor: '#FF6B35',
                boxShadow: '0 0 40px rgba(255,107,53,0.5), inset 0 0 30px rgba(255,107,53,0.1)'
              }}
            >
              <div className="aspect-square w-full flex flex-col items-center justify-center text-center space-y-6">
                <div
                  className="text-8xl font-black"
                  style={{
                    color: '#FF10F0',
                    textShadow: '0 0 30px rgba(255,16,240,1), 0 0 60px rgba(255,16,240,0.5)',
                    WebkitTextStroke: '2px rgba(255,16,240,0.5)',
                    fontFamily: 'serif'
                  }}
                >
                  粵語
                </div>

                <div
                  className="text-5xl font-black"
                  style={{
                    color: '#00F0FF',
                    textShadow: '0 0 20px rgba(0,240,255,1)'
                  }}
                >
                  6 ÂM ĐIỆU
                </div>

                <p className="text-xl text-gray-200 font-semibold">
                  Giàu sắc thái • Độc đáo • Đầy mê hoặc
                </p>

                <div className="flex gap-4 text-4xl">
                  🏙️ 🥟 🎤 📺
                </div>
              </div>

              {/* Glow ring */}
              <div
                className="absolute -inset-4 rounded-3xl opacity-40 blur-2xl -z-10"
                style={{background: 'radial-gradient(circle, rgba(255,107,53,0.6) 0%, transparent 70%)'}}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function TestimonialsStrip() {
  const testimonials = [
    { name: 'Thắm', location: 'TP.HCM • 西貢', text: 'Giao diện rất Hong Kong vintage. Ôn âm điệu dễ hình dung.', stars: 5 },
    { name: 'Minh', location: 'Hà Nội • 河內', text: 'Flashcard trộn jyutping + nghĩa Việt—học cực nhanh.', stars: 5 },
    { name: '玲玲', location: '九龍城 • Kowloon', text: '有TVB味道。練習多，寫字好玩。', stars: 5 }
  ]

  return (
    <section className="relative py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Title */}
        <div className="text-center mb-16">
          <h2
            className="text-5xl md:text-6xl font-black mb-4"
            style={{
              color: '#FFD700',
              textShadow: '0 0 20px rgba(255,215,0,0.9), 0 0 40px rgba(255,215,0,0.5)',
              WebkitTextStroke: '1px rgba(255,215,0,0.5)'
            }}
          >
            學生評價 • HỌC VIÊN NÓI GÌ?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: i * 0.1}}
              viewport={{once: true}}
              className="relative rounded-2xl p-6 backdrop-blur-md border-2"
              style={{
                background: 'rgba(0,0,0,0.7)',
                borderColor: '#00F0FF',
                boxShadow: '0 0 20px rgba(0,240,255,0.3), inset 0 0 15px rgba(0,240,255,0.1)'
              }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.stars)].map((_, si) => (
                  <Star
                    key={si}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    style={{filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.8))'}}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-white/90 italic text-lg mb-4 leading-relaxed">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <div>
                  <div className="font-black text-white">{t.name}</div>
                  <div className="text-sm text-gray-400">{t.location}</div>
                </div>
                <Heart className="h-6 w-6 text-pink-400" style={{filter: 'drop-shadow(0 0 6px rgba(255,16,240,0.8))'}} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="relative py-12 px-4 border-t-4 border-pink-500/30">
      <div className="container mx-auto max-w-7xl">
        <div
          className="rounded-3xl p-8 backdrop-blur-md border-2"
          style={{
            background: 'rgba(0,0,0,0.7)',
            borderColor: '#FF10F0',
            boxShadow: '0 0 30px rgba(255,16,240,0.3)'
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div
                className="h-16 w-16 rounded-2xl border-4 grid place-items-center"
                style={{
                  background: 'linear-gradient(135deg, #FF6B35 0%, #F093FB 100%)',
                  borderColor: '#FFD700',
                  boxShadow: '0 0 20px rgba(255,215,0,0.6)'
                }}
              >
                <span className="text-4xl font-black">粵</span>
              </div>
              <div>
                <div
                  className="text-2xl font-black"
                  style={{
                    color: '#00F0FF',
                    textShadow: '0 0 10px rgba(0,240,255,0.8)'
                  }}
                >
                  學粵語 • HỌC TIẾNG QUẢNG
                </div>
                <div className="text-sm text-gray-400 font-semibold">
                  Hào Hoa Chợ Lớn × 九龍城
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <div className="text-gray-300 font-semibold">
                © {new Date().getFullYear()} • Made with <Heart className="inline h-4 w-4 text-red-400" /> by HaoHoaChoLon
              </div>
              <div className="text-xs text-gray-500 mt-1">
                香港風格 • Phong cách Hồng Kông 🏮
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function ToneBadge({tone, label}: {tone: number, label: string}) {
  const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6']
  const color = colors[(tone - 1) % colors.length]

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-bold text-sm border-2 transition-all hover:scale-110"
      style={{
        background: `${color}20`,
        borderColor: color,
        boxShadow: `0 0 15px ${color}60`,
        color: 'white'
      }}
    >
      <span
        className="h-3 w-3 rounded-full animate-pulse"
        style={{
          background: color,
          boxShadow: `0 0 10px ${color}`
        }}
      />
      {label}
    </span>
  )
}
