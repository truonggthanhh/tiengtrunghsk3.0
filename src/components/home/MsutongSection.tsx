import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TextbookPicker from '@/components/TextbookPicker';

export default function MsutongSection() {
  return <section className="learning-section" aria-labelledby="textbooks-home-title"><div className="section-heading"><div><p className="section-eyebrow">HỌC THEO GIÁO TRÌNH</p><h2 id="textbooks-home-title">Bạn đang học giáo trình nào?</h2><p>Chọn bộ sách trước, sau đó chọn quyển, bài và hoạt động muốn luyện.</p></div><Link to="/mandarin/textbooks" className="section-text-link">Tất cả giáo trình<ArrowRight className="h-4 w-4" /></Link></div><TextbookPicker /></section>;
}
