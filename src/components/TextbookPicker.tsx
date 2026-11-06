import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen } from 'lucide-react';

const textbookFamilies = [
  { slug: 'msutong', title: 'Msutong', scope: 'Sơ cấp · Trung cấp · Cao cấp', detail: '12 quyển · 120 bài · 3.403 mục từ. Chọn cấp độ, quyển và bài để luyện tập.', href: '/mandarin/textbooks?curriculum=msutong' },
  { slug: 'boya', title: 'Boya', scope: 'Sơ cấp II · bản 2', detail: '25 bài · 836 mục từ từ nguồn cộng đồng. Chưa gồm các quyển Boya khác.', href: '/mandarin/textbooks?level=boya' },
  { slug: 'han-ngu', title: 'Giáo trình Hán ngữ', scope: 'Quyển 2 · nguồn cộng đồng', detail: '25 bài · 1.046 mục từ. Chưa gồm trọn bộ 6 quyển; lần xuất bản chưa được xác nhận.', href: '/mandarin/textbooks?level=han-ngu' },
  { slug: 'hsk-standard', title: 'Giáo trình chuẩn HSK', scope: 'HSK 1–5 · 7 tập', detail: '107 bài/nhóm · 2.914 mục từ từ nguồn cộng đồng. Chưa có HSK 6.', href: '/mandarin/textbooks?level=hsk-standard' },
] as const;

export default function TextbookPicker() {
  return <div className="grid gap-4 sm:grid-cols-2" aria-label="Chọn giáo trình">{textbookFamilies.map(item => <Link key={item.slug} to={item.href} className="group rounded-2xl border bg-card p-5 transition-colors hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary sm:p-6"><div className="flex items-center justify-between text-primary"><BookOpen className="h-6 w-6" /><ArrowUpRight className="h-5 w-5" /></div><h3 className="mt-5 text-xl font-bold">{item.title}</h3><p className="mt-2 text-sm font-medium text-primary">{item.scope}</p><p className="mt-3 text-sm leading-6 text-muted-foreground">{item.detail}</p><span className="mt-5 block text-sm font-semibold">Chọn quyển và bài học →</span></Link>)}</div>;
}
