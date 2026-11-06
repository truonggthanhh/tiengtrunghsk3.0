import { Link } from 'react-router-dom';
import type { LearningLanguage } from '@/lib/auth/navigation';
import type { PolicyChoice } from '@/lib/policyConsent';
export default function PolicyAcknowledgement({ language, prefix, value, onChange }: { language: LearningLanguage; prefix: string; value: PolicyChoice; onChange: (choice: PolicyChoice) => void }) {
  const url = (slug: string) => `/legal/${slug}?from=${language}`;
  return <div className="space-y-3 rounded-xl border p-3 text-xs leading-6">
    <label className="flex items-start gap-2"><input id={`${prefix}-age`} type="checkbox" className="mt-1.5 h-4 w-4 shrink-0" checked={value.age} onChange={e => onChange({ ...value, age: e.target.checked })} /><span>Tôi từ đủ 16 tuổi.</span></label>
    <label className="flex items-start gap-2"><input id={`${prefix}-terms`} type="checkbox" className="mt-1.5 h-4 w-4 shrink-0" checked={value.terms} onChange={e => onChange({ ...value, terms: e.target.checked })} /><span>Tôi đã đọc và đồng ý với <Link className="text-primary underline" to={url('terms')} target="_blank" rel="noopener">Điều khoản sử dụng</Link>.</span></label>
    <label className="flex items-start gap-2"><input id={`${prefix}-processing`} type="checkbox" className="mt-1.5 h-4 w-4 shrink-0" checked={value.processing} onChange={e => onChange({ ...value, processing: e.target.checked })} /><span>Tôi đồng ý việc xử lý dữ liệu cần thiết để tạo, đăng nhập và cung cấp tài khoản học theo <Link className="text-primary underline" to={url('data-processing')} target="_blank" rel="noopener">Thông báo xử lý dữ liệu</Link> và <Link className="text-primary underline" to={url('privacy')} target="_blank" rel="noopener">Chính sách bảo mật</Link>. Không bao gồm tiếp thị hoặc cấp quyền micro.</span></label>
  </div>;
}
