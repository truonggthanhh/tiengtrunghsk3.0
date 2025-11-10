import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Headphones, Keyboard, PenTool, Zap, PlayCircle, Sparkles, Music, ListChecks, ToggleRight, Star, Volume2 } from 'lucide-react'
import DarkModeToggle from '@/cantonese/components/ui/DarkModeToggle'
import JyutpingToggle from '@/cantonese/components/ui/JyutpingToggle'
import { Link, useNavigate } from 'react-router-dom'
import { BackgroundTexture } from '@/cantonese/components/ui/BackgroundTexture'
import UserMenu from '@/cantonese/components/UserMenu'
import { useSession } from '@/cantonese/components/providers/SessionContextProvider'
import { useProfile } from '@/cantonese/components/providers/ProfileProvider'
import { supabase } from '@/cantonese/integrations/supabase/client'
import { toast } from 'sonner'
import SpeakerButton from '@/cantonese/components/SpeakerButton'

export default function Index(){ return <HongKongRetroLanding/> }

function HongKongRetroLanding() {
  const { session, isLoading: isSessionLoading } = useSession();
  const { isAdmin, isLoadingProfile } = useProfile();

  // Render loading state if session or profile is still loading
  if (isSessionLoading || isLoadingProfile) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  return (
    <main className="min-h-screen">
      <BackgroundTexture variant="default" />
      <Navbar />
      <Hero />
      <SellingPoints />
      <ExercisesShowcase />
      <CantoneseFeaturesIntro /> {/* Thay thế FlashcardDemo bằng CantoneseFeaturesIntro */}
      <BilingualTracks />
      <TestimonialsStrip />
      <Footer />
    </main>
  )
}

function Navbar(){
  return (
    <div className="relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-xl border border-ink/20 bg-jade grid place-items-center shadow-[0_0_0_2px_rgba(0,0,0,0.2)]">
              <span className="text-cream font-black tracking-wider">粵</span>
            </div>
            <div>
              <div className="text-ink font-extrabold leading-none tracking-wide">Học tiếng Quảng Đông</div>
              <div className="text-xs text-ink/80">cùng Hào Hoa Chợ Lớn</div>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-ink">
            <Link to="/cantonese/lessons" className="hover:opacity-80">Bài học</Link>
            <Link to="/cantonese/songs" className="hover:opacity-80">Bài hát</Link>
            <a href="#features" className="hover:opacity-80">Tính năng</a>
            <a href="#exercises" className="hover:opacity-80">Bài tập</a>
            <a href="#tracks" className="hover:opacity-80">Lộ trình</a>
          </div>
          <div className="flex items-center gap-2">
            <JyutpingToggle/>
            <DarkModeToggle/>
            <UserMenu />
          </div>
        </div>
      </div>
    </div>
  )
}

function Hero(){
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <NeonHeader />
            <p className="mt-6 text-lg text-ink/90">Học tiếng Quảng Đông theo chuẩn phiên âm Việt Bính (Jyutping) quốc tế.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/cantonese/lessons" className="inline-flex items-center gap-2 rounded-2xl bg-verm px-5 py-3 font-semibold text-ink shadow-[0_8px_0_#8f2a22] hover:translate-y-0.5 active:translate-y-1 transition-transform"><Zap className="h-5 w-5" /> Vào học</Link>
              <Link to="/cantonese/songs" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-neonCyan to-neonPink px-5 py-3 font-semibold text-cream shadow-[0_8px_0_var(--neon-pink-shadow)] hover:translate-y-0.5 active:translate-y-1 transition-transform"><Music className="h-5 w-5" /> Học qua bài hát</Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-ink/80">
              <ToneBadge tone={1} label="Âm 1" />
              <ToneBadge tone={2} label="Âm 2" />
              <ToneBadge tone={3} label="Âm 3" />
              <ToneBadge tone={4} label="Âm 4" />
              <ToneBadge tone={5} label="Âm 5" />
              <ToneBadge tone={6} label="Âm 6" />
            </div>
          </div>
          <div className="relative"><HKLightbox /></div>
        </div>
      </div>
    </section>
  )
}

function NeonHeader(){
  return (
    <div className="inline-block">
      <motion.h1 data-testid="hero-title" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.6}} className="text-4xl sm:text-5xl md:text-5xl font-black tracking-tight text-ink">
        <span className="block leading-tight">Học Tiếng Quảng Đông - Ăn đồ Hồng Kông</span>
        <span className="block leading-tight mt-2"><span className="neon-cyan">粵語</span><span className="mx-2">•</span><span className="neon-pink">香港味</span></span>
      </motion.h1>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white dark:bg-black/20 px-3 py-1 text-ink/80 text-xs font-bold text-jade dark:text-neon-cyan shadow-[0_0_10px_rgba(31,111,94,0.3)] dark:shadow-[0_0_10px_rgba(123,240,241,0.3)]">
        <Sparkles className="h-3.5 w-3.5" /> Hệ thống học tập tiếng Quảng Đông đầu tiên và trực quan tại Việt Nam
      </div>
    </div>
  )
}

function HKLightbox(){
  return (
    <motion.div initial={{opacity:0,scale:.98}} animate={{opacity:1,scale:1}} transition={{duration:.5,delay:.1}} className="relative rounded-3xl border-2 border-ink/10 bg-jade/20 p-3 shadow-[0_0_40px_rgba(80,227,230,0.25)]">
      <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-cream text-ink">
        <div className="grid h-full grid-cols-3">
          <div className="bg-white dark:bg-black/20 p-6">
            <h3 className="font-extrabold tracking-wide text-jade">粵語入門</h3>
            <p className="mt-2 text-sm opacity-80">Flashcard • Nghe • Điền chỗ trống • Viết chữ Hán</p>
            <ul className="mt-4 space-y-2 text-sm list-disc list-inside">
              <li>Từ vựng theo chủ đề</li>
              <li>Âm điệu (1-6) trực quan</li>
              <li>Ví dụ thực tế phong cách TVB</li>
            </ul>
          </div>
          <div className="relative bg-cream">
            <div className="absolute inset-4 rounded-xl border border-black/10 p-4">
              <div className="mb-2 text-xs font-semibold">Flashcard</div>
              <div className="grid h-full place-items-center rounded-lg bg-white dark:bg-black/20">
                <div className="text-center">
                  <div className="text-3xl font-black">食飯</div>
                  <div className="mt-1 text-xs text-black/70 dark:text-white/70">sik6 faan6 • ăn cơm</div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-black/20 p-6">
            <h3 className="font-extrabold tracking-wide text-verm">香港味</h3>
            <p className="mt-2 text-sm opacity-80">Trà đá, xíu mại, đèn neon—học như đang ở Cửu Long.</p>
            <div className="mt-3 text-xs">Giao diện mô phỏng bảng hiệu neon với ánh sáng hắt.</div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute -inset-2 rounded-3xl ring-2 ring-[--neon-cyan]/50 blur-0" />
    </motion.div>
  )
}

function SellingPoints(){
  const items=[
    { icon: BookOpen, title: 'Kho bài học đa dạng', desc: 'Nội dung được biên soạn kỹ lưỡng, cập nhật liên tục, giúp bạn tiếp cận kiến thức một cách toàn diện.' },
    { icon: Headphones, title: 'Nghe – nói chuẩn giọng HK', desc: 'Hệ thống audio chất lượng cao, kèm phiên âm Jyutping & IPA, giúp bạn luyện phát âm chuẩn xác 6 âm điệu.' },
    { icon: Keyboard, title: 'Ôn tập hiệu quả', desc: 'Đa dạng bài tập: Flashcard, điền chỗ trống, sắp xếp câu, trắc nghiệm... giúp củng cố kiến thức một cách chủ động.' },
    { icon: PenTool, title: 'Luyện viết chữ Hán', desc: 'Hướng dẫn từng nét, nhận diện bút thuận – bút nghịch, giúp bạn nắm vững cách viết chữ Hán truyền thống.' },
  ]
  return (
    <section id="features" className="relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-2xl md:text-3xl font-black text-ink mb-8 text-center">Các điểm nổi bật</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((it,i)=> (
            <div key={i} className="group rounded-2xl border border-ink/15 bg-white dark:bg-black/20 p-5 text-ink backdrop-blur shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:bg-black/5 dark:hover:bg-white/5">
              <it.icon className="h-6 w-6 mb-3"/>
              <h4 className="font-extrabold">{it.title}</h4>
              <p className="mt-2 text-sm opacity-90">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ExercisesShowcase(){
  const items=[
    { icon: BookOpen, title: 'Flashcard', desc: 'Học từ vựng trực quan, lật thẻ để xem nghĩa và ví dụ thực tế.' },
    { icon: Keyboard, title: 'Điền vào chỗ trống', desc: 'Luyện ngữ pháp và từ vựng bằng cách hoàn thành các câu thực tế.' },
    { icon: ListChecks, title: 'Trắc nghiệm', desc: 'Kiểm tra kiến thức tổng hợp qua các câu hỏi trắc nghiệm đa dạng.' },
    { icon: ToggleRight, title: 'Đúng/Sai', desc: 'Thử thách khả năng đọc hiểu và phán đoán nhanh với các mệnh đề.' },
    { icon: Keyboard, title: 'Sắp xếp câu', desc: 'Rèn luyện tư duy cú pháp và cấu trúc câu bằng cách sắp xếp các từ bị xáo trộn.' },
    { icon: PenTool, title: 'Luyện viết chữ Hán', desc: 'Hướng dẫn chi tiết từng nét bút, giúp bạn nắm vững cách viết chữ Hán.' },
  ]
  return (
    <section id="exercises" className="relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl md:text-3xl font-black text-ink mb-6">Bài tập chủ lực</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         {items.map((it,i)=> (
            <div key={i} className="rounded-2xl border-2 border-ink/10 bg-white dark:bg-black/20 p-5 text-ink shadow-[0_10px_0_#d7c8b6]">
              <div className="flex items-center gap-2"><it.icon className="h-5 w-5"/><h4 className="font-extrabold tracking-wide">{it.title}</h4></div>
              <p className="mt-2 text-sm opacity-90">{it.desc}</p>
              <div className="mt-4 h-1 w-16 bg-verm"/>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CantoneseFeaturesIntro(){
  return (
    <section id="cantonese-features" className="relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1">
            <h3 className="text-2xl md:text-3xl font-black text-ink">Tiếng Quảng Đông: Nhịp thở của văn hóa</h3>
            <p className="mt-3 text-ink/90">
              Tiếng Quảng Đông không chỉ là ngôn ngữ, mà là nhịp thở của một nền văn hoá.
              Với hệ thống thanh điệu phức tạp và giàu sắc thái, nó mang theo chiều sâu lịch sử từ thời Hán cổ đến đời sống hiện đại của Hong Kong.
              Người Quảng nói nhanh, sắc – nhưng nếu lắng nghe kỹ, bạn sẽ cảm nhận được sự tinh tế trong từng âm tiết.
              Hiểu một ngôn ngữ là chạm vào linh hồn của một cộng đồng. Tiếng Quảng Đông là một cánh cửa như thế.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-ink/80">
              <ToneBadge tone={1} label="Âm 1" />
              <ToneBadge tone={2} label="Âm 2" />
              <ToneBadge tone={3} label="Âm 3" />
              <ToneBadge tone={4} label="Âm 4" />
              <ToneBadge tone={5} label="Âm 5" />
              <ToneBadge tone={6} label="Âm 6" />
            </div>
          </div>
          <div className="order-1 lg:order-2 relative rounded-3xl border-2 border-ink/10 bg-verm/20 p-3 shadow-[0_0_40px_rgba(209,74,65,0.25)]">
            <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-cream text-ink flex items-center justify-center p-6">
              <div className="text-center">
                <div className="text-5xl font-black neon-pink">粵語</div>
                <div className="text-2xl font-bold mt-2 neon-cyan">6 Âm Điệu</div>
                <p className="mt-4 text-lg text-ink/80">Giàu sắc thái, độc đáo và đầy mê hoặc.</p>
              </div>
            </div>
            <div className="pointer-events-none absolute -inset-2 rounded-3xl ring-2 ring-[--neon-pink]/50 blur-0" />
          </div>
        </div>
      </div>
    </section>
  )
}


function BilingualTracks(){
  return (
    <section id="tracks" className="relative z-10 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <TrackCard 
            titleVI="Lộ trình học tiếng Quảng Đông cho người Việt" 
            titleZH="越南朋友學粵語" 
            bullets={[
              "Bắt đầu từ các bài học nền tảng, củng cố kiến thức qua hệ thống bài tập đa dạng.",
              "Học một cách thú vị qua các bài hát nổi tiếng, kết hợp giải trí và ghi nhớ từ vựng.",
              "Luyện tập viết chữ Hán, theo dõi tiến độ và chinh phục các thử thách để thành thạo."
            ]} 
            badge="VI → 粵" 
            accent="var(--jade)"
          />
        </div>
      </div>
    </section>
  )
}

function TrackCard({ titleVI, titleZH, bullets, badge, accent }:{ titleVI:string, titleZH:string, bullets:string[], badge:string, accent:string }){
  return (
    <div className="rounded-3xl border-2 border-ink/10 bg-white dark:bg-black/20 p-6 text-ink backdrop-blur">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-ink/20 bg-cream/10 px-3 py-1 text-xs"><span className="h-2 w-2 rounded-full" style={{background:accent}}/>{badge}</div>
      <h4 className="text-xl font-black">{titleVI}</h4>
      <div className="text-ink/90">{titleZH}</div>
      <ul className="mt-3 space-y-2 text-sm list-disc list-inside">{bullets.map((b,i)=>(<li key={i}>{b}</li>))}</ul>
    </div>
  )
}

function TestimonialsStrip(){
  const testimonials = [
    { name: 'Thắm', location: 'TP.HCM', text: 'Giao diện rất ‘Hong Kong vintage’. Ôn âm điệu dễ hình dung.' },
    { name: 'Minh', location: 'Hà Nội', text: 'Flashcard trộn jyutping + nghĩa Việt—học cực nhanh.' },
    { name: '玲玲', location: '九龍城', text: '有TVB味道。練習多，寫字好玩。' }
  ];

  return (
    <section className="relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl md:text-3xl font-black text-ink mb-8 text-center">Học viên nói gì?</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-2xl border-2 border-ink/10 bg-white dark:bg-black/20 p-6 text-ink shadow-[0_10px_0_#d7c8b6] flex flex-col">
              <div className="flex items-center gap-1 text-yellow-400 mb-3">
                {[...Array(5)].map((_, starIndex) => (
                  <Star key={starIndex} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="text-ink/90 italic flex-grow">“{t.text}”</p>
              <div className="mt-4 font-extrabold text-right">— {t.name}, {t.location}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer(){ // Không còn nhận props
  const navigate = useNavigate();
  const { session } = useSession(); // Lấy session từ context
  const { isAdmin } = useProfile(); // Lấy isAdmin từ context

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(`Lỗi khi đăng xuất: ${error.message}`);
    } else {
      toast.success('Đã đăng xuất thành công!');
      navigate('/');
    }
  };

  return (
    <footer className="relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-3xl border border-ink/15 bg-white dark:bg-black/20 p-6 text-ink backdrop-blur">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl border border-ink/20 bg-jade grid place-items-center">
                <span className="text-cream font-black">粵</span>
              </div>
              <div className="font-extrabold">Học tiếng Quảng Đông cùng Hào Hoa Chợ Lớn</div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-xs text-ink/80">© {new Date().getFullYear()} – Made by HaoHoaChoLon.</div>
              {session && isAdmin ? (
                <button onClick={handleLogout} className="text-xs text-verm hover:text-red-700 transition underline">Đăng xuất Admin</button>
              ) : (
                <Link to="/cantonese/dashboard" className="text-xs text-ink/60 hover:text-ink transition">Admin Login</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function ToneBadge({tone,label}:{tone:number,label:string}){
  const colors=['#e74c3c','#e67e22','#f1c40f','#2ecc71','#3498db','#9b59b6']
  const c = colors[(tone-1)%colors.length]
  return (
    <span data-testid="tone-badge" className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white dark:bg-black/20 px-3 py-1 text-ink text-xs" style={{boxShadow:`0 0 0 2px ${c}33 inset`}}>
      <span className="h-2 w-2 rounded-full" style={{background:c}}/>{label}
    </span>
  )
}