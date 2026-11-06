import { Link } from 'react-router-dom';
import { policyPages } from '@/data/legal/policies';
export default function LegalLinks({ language = 'mandarin' }: { language?: 'mandarin' | 'cantonese' }) {
  return <nav aria-label="Điều khoản và chính sách" className="flex flex-wrap gap-x-5 gap-y-3 text-xs text-muted-foreground">{policyPages.map(item => <Link key={item.slug} to={`/legal/${item.slug}?from=${language}`} className="hover:text-primary hover:underline">{item.title}</Link>)}</nav>;
}
