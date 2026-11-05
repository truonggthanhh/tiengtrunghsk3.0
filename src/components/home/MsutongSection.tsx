import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, LibraryBig } from 'lucide-react';
import { msutongBooks, msutongBookUrl } from '@/lib/msutongSelection';

export default function MsutongSection() {
  return <section className="learning-section" aria-labelledby="msutong-home-title">
    <div className="section-heading"><div><p className="section-eyebrow">HỌC THEO GIÁO TRÌNH</p><h2 id="msutong-home-title">Msutong — chọn quyển, chọn bài, bắt đầu học.</h2><p>Ôn theo từng bài hoặc kết hợp nhiều bài để luyện từ vựng và các kỹ năng.</p></div><Link to="/mandarin/msutong" className="section-text-link">Mở giáo trình Msutong<ArrowRight className="h-4 w-4" /></Link></div>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{msutongBooks.map(book => <Link to={msutongBookUrl(book.slug)} key={book.slug} className="group rounded-2xl border bg-card p-5 transition-colors hover:border-primary/50"><div className="mb-5 flex items-center justify-between"><LibraryBig className="h-6 w-6 text-primary" /><span className="text-2xl font-bold text-primary/30">0{book.number}</span></div><p className="text-[10px] font-bold tracking-wider text-muted-foreground">MSUTONG · SƠ CẤP</p><h3 className="mt-2 text-xl font-bold">{book.name}</h3><p className="mt-4 flex items-center justify-between text-xs font-semibold text-primary">Chọn bài học<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></p></Link>)}</div>
  </section>;
}
